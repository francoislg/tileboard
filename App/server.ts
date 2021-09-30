import fs from "fs";
import Express from "express";
import bodyParser from "body-parser";
import { SOCKET_PORT } from "./socket";
import * as lockFile from "lockfile";
import { promisify } from "util";
import type { IAppConfig } from "./TileConfig";
import { WebSocketServer, WebSocket } from "ws";
import type { ITileUpdatePayload } from "./payloads";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw "You must provide the API_KEY environment variable to run this server.";
}

const debounce = <T extends any[] | []>(
  f: (...args: T) => any,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: T) => {
    !!timeout && clearTimeout(timeout);
    timeout = setTimeout(() => f(...args), wait);
  };
};

const app = Express();
const HOST = process.env.SERVER_HOST || "0.0.0.0";
const PORT = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 7272;

const wss = new WebSocketServer({ port: SOCKET_PORT });
wss.on("connection", (client) => {
  console.log("Socket connected");

  loadConfiguration().then((config) =>
    client.send(
      JSON.stringify({
        type: "config",
        ...config,
      })
    )
  );
});

function emitToAll(type: string, data: any) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type,
        ...data,
      }))
    }
  })
}

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//Serve static files
app.use("/assets", Express.static("assets"));

app.use("/dashboard", (req, res) => {
  res.send(renderFullPage());
});

const renderFullPage = () => {
  return `<!DOCTYPE html>
    <html>
      <head>
        <title>Tileboard</title>

      </head>
      <body>
        <div id="root"></div>
        <script src="/assets/client.js"></script>
      </body>
    </html>
`;
};

const isValidBearer = (apiKey?: string): apiKey is string  => {
  const matches = `${apiKey}`.match(/Bearer (.+)/);
  return !!matches && matches.length > 0 && matches[1] === API_KEY;
};

app.use(async (req, res, next) => {
  const apiKey = req.get("Authorization");
  if (!isValidBearer(apiKey)) {
    res.status(401).json({ error: "unauthorised" });
  } else {
    if (!configuration) {
      await loadConfiguration();
    }
    next();
  }
});

type IStorageConfig = {
  config: IAppConfig;
};
let configuration: IStorageConfig;
const defaultConfiguration: IStorageConfig = { config: { tiles: [] } };

const lock = promisify(lockFile.lock);
const unlock = promisify(lockFile.unlock);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);

const file = "./data/config.json";
const saveConfiguration = debounce(async () => {
  console.log("Trying to save configuration");
  try {
    await mkdir("./data");
  } catch (err: any) {
    // Ignore if the directory already exist.
    const DIR_ALREADY_EXIST_CODE = -17;
    if (err.errno !== DIR_ALREADY_EXIST_CODE) {
      throw err;
    }
  }

  try {
    await lock(file + ".lock");
  } catch (err) {
    console.error(err);
    // Try again later.
    setTimeout(saveConfiguration, 5000);
    return;
  }

  console.log("Saving configuration");

  await writeFile(file, JSON.stringify(configuration, null, 2));
  await unlock(file + ".lock");

  console.log("Configuration saved properly.");
}, 2000);
const tryParseJsonOrDefault = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return defaultConfiguration;
  }
};
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
  const body: IStorageConfig["config"] = req.body || {};
  configuration = {
    config: {
      ...configuration.config,
      ...body,
    },
  } as IStorageConfig;
  emitToAll("config", configuration);
  await saveConfiguration();
  res.end();
});

app.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const value = body.value;
  const timestamp = Date.now();
  const tileToUpdate = configuration.config.tiles.find(
    (tile) => tile.id === id
  );
  if (tileToUpdate) {
    tileToUpdate.value = value;
    tileToUpdate.lastTimestamp = timestamp;
  }
  const payload: ITileUpdatePayload<any> = {
    id,
    value,
    lastTimestamp: timestamp,
  };
  emitToAll("tile", payload);
  await saveConfiguration();
  res.end();
});

console.log(`Listening on ${HOST}:${PORT}`);

app.listen(PORT);
