import React from "react";
import { useTileUpdate } from "./useTileUpdate";
import "./CheckboxMatrix.scss";
import { IDefaultTileProps } from "./DefaultTileProps";
import { EmojiCheckbox } from "./components/EmojiCheckbox";

export type CheckboxMatrixItems = boolean[][];

export const CheckboxMatrix: React.FunctionComponent<
  IDefaultTileProps<CheckboxMatrixItems> & {
    columnLabels: string[];
    rowLabels: string[];
  }
> = ({ id, columnLabels, rowLabels, initialValue }) => {
  const [values, _] = useTileUpdate<CheckboxMatrixItems>(id, initialValue || []);

  return (
    <div
      className="checkbox-matrix-tile"
      style={{
        gridTemplateColumns: `1fr repeat(${columnLabels.length}, 1fr)`,
        gridTemplateRows: `1fr repeat(${rowLabels.length}, 1fr)`,
      }}
    >
      <div></div>
      {columnLabels.map(column => <div>{column}</div>)}
      {rowLabels.map((row, rowIndex) => (<>
          <div>{row}</div>
          {columnLabels.map((_, colIndex) => (
             <>
             <div><EmojiCheckbox value={values?.[rowIndex]?.[colIndex]} /></div>
           </>
          ))}
        </>
      ))}
    </div>
  );
};
