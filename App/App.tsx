import React from "react";
import { getSocket, MessagesTypes, IConfigPayload } from "./socket";
import { Single } from "./tiles/Single";
import { ITileConfig } from "./TileConfig";
import { InvalidType } from "./tiles/InvalidType";

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
  const [tiles, setTiles] = React.useState([{
    id: 'empty',
    type: 'single'
  }] as ITileConfig[]);

  React.useEffect(() => {
    const listener = (payload: IConfigPayload) => {
      const tiles = payload?.config?.tiles;
      setTiles(tiles);
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
        <div key={tile.id}>{tileConfigToElement(tile)}</div>
      ))}
    </div>
  );
};
