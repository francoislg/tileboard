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

const app = Express();
const port = 3000;

const server = createServer(app);
const io = listen(server);

io.listen(SOCKET_PORT);

let configuration: IConfigPayload;

const saveConfiguration = () => {
  fs.writeFile(
    "./config.json",
    JSON.stringify(configuration, null, 2),
    (err) => !!err && console.error(err)
  );
};
const loadConfiguration = () => {
  return new Promise((res, rej) => {
    fs.readFile("./config.json", (err, data) => {
      let loadedConfig = !!err ? { config: { tiles: [] } } : JSON.parse(data.toString())
      configuration = loadedConfig;
      res(loadedConfig);
    });
  });
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
  saveConfiguration();
  res.end();
});

app.post("/update/:id", (req, res) => {
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
  saveConfiguration();
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
