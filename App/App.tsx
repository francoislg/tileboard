import React from "react";
import { getSocket, MessagesTypes, IConfigPayload } from "./socket";
import { IAppConfig } from "./TileConfig";
import { LayoutWithTimeout } from "./LayoutWithTimeout";
import { tileConfigToElement } from "./factories";
import "./App.scss";
import { ConfigContextProvider } from "./useConfigContext";

export const App = () => {
  const [config, setConfig] = React.useState<IAppConfig>({
    tiles: [],
  });

  const { tiles = [], defaultTimeout = 120000, direction = "row" } = config;

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
    <ConfigContextProvider value={config}>
      <div className="background container" style={{ gridAutoFlow: direction }}>
        {tiles.map((tile) => (
          <LayoutWithTimeout
            key={tile.id}
            id={tile.id}
            title={tile.title}
            layout={tile.layout}
            layoutProps={tile.layoutProps}
            defaultLastTimestamp={tile.lastTimestamp}
            timeInMs={defaultTimeout}
          >
            {tileConfigToElement(tile)}
          </LayoutWithTimeout>
        ))}
      </div>
    </ConfigContextProvider>
  );
};
