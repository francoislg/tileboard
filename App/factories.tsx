import * as React from "react";
import { Checkbox } from "./tiles/Checkbox";
import { InvalidType } from "./tiles/InvalidType";
import { ITileConfig } from "./TileConfig";
import { RectangleTile } from "./layout/RectangleTile";
import { LabeledList } from "./tiles/LabeledList";
import { IDefaultLayoutProps } from "./layout/DefaultLayoutProps";
import { IDefaultTileProps } from "./tiles/DefaultTileProps";
import { CheckboxMatrix } from "./tiles/CheckboxMatrix";

type TileFactory = {
  [name: string]: React.FunctionComponent<IDefaultTileProps<any>>;
};

const tileFactory: TileFactory = {
  checkbox: Checkbox,
  labeledlist: LabeledList,
  checkboxmatrix: CheckboxMatrix,
};

type LayoutFactory = {
  [name: string]: React.FunctionComponent<IDefaultLayoutProps>;
};

const layoutFactory: LayoutFactory = {
  square: RectangleTile,
  rectangle: (props: IDefaultLayoutProps) => (
    <RectangleTile width={2} {...props} />
  ),
  large: (props: IDefaultLayoutProps) => (
    <RectangleTile width={2} height={2} {...props} />
  ),
};

export const getTileElement = (tileType: string) =>
  tileFactory[tileType?.toLowerCase()] || InvalidType;
export const getLayoutElement = (layout: string) =>
  layoutFactory[layout?.toLowerCase() || "square"] || layoutFactory.square;

export const tileConfigToElement = (tile: ITileConfig) => {
  const Element = getTileElement(tile.type);
  return (
    <Element id={tile.id} initialValue={tile.initialValue} {...tile.props} />
  );
};
