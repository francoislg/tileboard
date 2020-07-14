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

const app = Express();
const port = 3000;

const server = createServer(app);
const io = listen(server);

io.listen(SOCKET_PORT);

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

app.use(bodyParser.json());

app.post("/config", async (req, res) => {
  if (!configuration) {
    await loadConfiguration();
  }
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

//Serve static files
app.use("/assets", Express.static("assets"));

// This is fired every time the server side receives a request
app.use((req, res) => {
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

console.log(`Listening on port ${port}`);

io.on("connection", () => {
  console.log("Socket connected");

  loadConfiguration().then(config => io.emit("config", config));
});

app.listen(port);
