import * as React from "react";
import { Single } from "./tiles/Single";
import { Checkbox } from "./tiles/Checkbox";
import { InvalidType } from "./tiles/InvalidType";
import { ITileConfig } from "./TileConfig";
import { SquareTile } from "./layout/SquareTile";

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
    square: SquareTile
}

export const tileConfigToElement = (tile: ITileConfig) => {
    const Element = tileFactory[tile.type] || InvalidType;
    const Layout = layoutFactory[tile.layout || 'square'] || layoutFactory.square;
    return <Layout id={tile.id}>
        <Element id={tile.id} initialValue={tile.initialValue} {...tile.props} />
    </Layout>
};