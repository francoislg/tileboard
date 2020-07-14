import * as React from "react";
import { Single } from "./tiles/Single";
import { Checkbox } from "./tiles/Checkbox";
import { InvalidType } from "./tiles/InvalidType";
import { ITileConfig } from "./TileConfig";
import { SquareTile } from "./layout/SquareTile";
import { RectangleTile } from "./layout/RectangleTile";
import { LargeSquareTile } from "./layout/LargeSquareTile";

type TileFactory = {
    [name: string]: React.FunctionComponent<{ id: string, initialValue?: any }>;
};

const tileFactory: TileFactory = {
    single: Single,
    checkbox: Checkbox
};

type LayoutFactory = {
    [name: string]: React.FunctionComponent<{ id: string }>;
};

const layoutFactory: LayoutFactory = {
    square: SquareTile,
    rectangle: RectangleTile,
    large: LargeSquareTile,
}

export const getTileElement = (tileType: string) => tileFactory[tileType] || InvalidType;
export const getLayoutElement = (layout: string) => layoutFactory[layout || 'square'] || layoutFactory.square;

export const tileConfigToElement = (tile: ITileConfig) => {
    const Element = getTileElement(tile.type);
    return <Element id={tile.id} initialValue={tile.initialValue} {...tile.props} />;
};