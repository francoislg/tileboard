import React from "react";
import { getSocket, MessagesTypes, IConfigPayload } from "./socket";
import { Single } from "./tiles/Single";
import { ITileConfig, IAppConfig } from "./TileConfig";
import { InvalidType } from "./tiles/InvalidType";
import { TileWithTimeout } from "./TileWithTimeout";

const tileFactory: {
  [name: string]: React.FunctionComponent<{ id: string }>;
} = {
  single: Single,
};

const tileConfigToElement = (tile: ITileConfig) => {
  const Element = tileFactory[tile.type] || InvalidType;
  return <Element id={tile.id} {...tile.props} />;
};

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
    <div>
      {tiles.map((tile) => (
        <div key={tile.id}>
          <TileWithTimeout id={tile.id} timeInMs={defaultTimeout}>
            {tileConfigToElement(tile)}
          </TileWithTimeout>
        </div>
      ))}
    </div>
  );
};
