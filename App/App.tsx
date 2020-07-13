import React from "react";
import { getSocket, MessagesTypes, IConfigPayload } from "./socket";
import { IAppConfig } from "./TileConfig";
import { TileWithTimeout } from "./TileWithTimeout";
import { tileConfigToElement } from "./factories";

export const App = () => {
  const [config, setConfig] = React.useState<IAppConfig>({
    tiles: [
    {
      id: "empty",
      type: "single",
    },
  ]});

  const {tiles = [], defaultTimeout = 20000} = config;

  React.useEffect(() => {
    const listener = (payload: IConfigPayload) => {
      payload?.config && setConfig(payload?.config);
    };
    const socket = getSocket();
    socket.on(MessagesTypes.CONFIG, listener);
    return () => {
      socket.off(MessagesTypes.CONFIG, listener);
    };
  });

  return (
    <div style={{display: "flex", justifyContent: "space-evenly"}}>
      {tiles.map((tile) => (
        <TileWithTimeout key={tile.id} id={tile.id} timeInMs={defaultTimeout}>
          {tileConfigToElement(tile)}
        </TileWithTimeout>
      ))}
    </div>
  );
};
