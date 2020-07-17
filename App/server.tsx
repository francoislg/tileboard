import { createServer } from "http";
import { listen } from "socket.io";
import fs from "fs";
import Express from "express";
import React from "react";
import { App } from "./App";
import ReactDomServer from "react-dom/server";
import bodyParser from "body-parser";
import {
  IConfigPayload,
  PORT as SOCKET_PORT,
  ITileUpdatePayload,
} from "./socket";
import lockFile from "lockfile";
import util from "util";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw "You must provide the API_KEY environment variable to run this server.";
}

const app = Express();
const HOST = "0.0.0.0";
const PORT = 7272;

const server = createServer(app);
const io = listen(server);

io.listen(SOCKET_PORT);

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

//Serve static files
app.use("/assets", Express.static("assets"));

app.use("/dashboard", (req, res) => {
  // Render the component to a string
  const html = ReactDomServer.renderToString(<App />);

  res.send(renderFullPage(html));
});

const renderFullPage = (html: string) => {
  return `<!DOCTYPE html>
    <html>
      <head>
        <title>Tileboard</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="/assets/client.js"></script>
      </body>
    </html>
`;
};

const bearerRegex = /Bearer (.+)/g;
const isValidBearer = (apiKey: string): boolean => {
  const matches = bearerRegex.exec(apiKey);
  return !!matches && matches.length > 0 && matches[1] === API_KEY;
}

app.use(async (req, res, next) => {
  const apiKey = req.get('Authorization');
  if (!isValidBearer(apiKey)) {
    res.status(401).json({error: 'unauthorised'});
  } else {
    if (!configuration) {
      await loadConfiguration();
    }
    next()
  }
})

let configuration: IConfigPayload;
const defaultConfiguration: IConfigPayload = { config: { tiles: [] } };

const lock = util.promisify(lockFile.lock);
const unlock = util.promisify(lockFile.unlock);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const file = "./config.json";
const saveConfiguration = async () => {
  try {
    await lock(file + ".lock");
  } catch (err) {
    // Try again later.
    setTimeout(saveConfiguration, 5000);
    return;
  }

  console.log("Saving configuration");

  await writeFile(file,  JSON.stringify(configuration, null, 2));
  await unlock(file + ".lock");
};
const tryParseJsonOrDefault = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return defaultConfiguration;
  }
}
const loadConfiguration = async () => {
  try {
    const data = await readFile(file);
    configuration = tryParseJsonOrDefault(data.toString());
  } catch (err) {
    configuration = defaultConfiguration;
  }
  return configuration;
};

app.post("/config", async (req, res) => {
  const body: IConfigPayload["config"] = req.body || {};
  configuration = {
    config: {
      ...configuration.config,
      ...body,
    },
  } as IConfigPayload;
  console.log("Updating configuration", configuration);
  io.emit("config", configuration);
  await saveConfiguration();
  res.end();
});

app.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const value = body.value;
  const tileToUpdate = configuration.config.tiles.find(
    (tile) => tile.id === id
  );
  if (tileToUpdate) {
    tileToUpdate.initialValue = value;
  }
  io.emit("tile", {
    id,
    value,
  } as ITileUpdatePayload<any>);
  await saveConfiguration();
  res.end();
});


console.log(`Listening on ${HOST}:${PORT}`);

io.on("connection", () => {
  console.log("Socket connected");

  loadConfiguration().then(config => io.emit("config", config));
});

app.listen(PORT, HOST);
