import React from "react";
import { getSocket, MessagesTypes, IConfigPayload } from "./socket";
import { IAppConfig } from "./TileConfig";
import { LayoutWithTimeout } from "./LayoutWithTimeout";
import { tileConfigToElement } from "./factories";
import "./App.scss";

export const App = () => {
  const [config, setConfig] = React.useState<IAppConfig>({
    tiles: [
      {
        id: "empty",
        type: "single",
      },
    ],
  });

  const { tiles = [], defaultTimeout = 120000 } = config;

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
    <div className="background container">
      {tiles.map((tile) => (
        <LayoutWithTimeout
          key={tile.id}
          id={tile.id}
          layout={tile.layout}
          layoutProps={tile.layoutProps}
          timeInMs={defaultTimeout}
        >
          {tileConfigToElement(tile)}
        </LayoutWithTimeout>
      ))}
    </div>
  );
};
