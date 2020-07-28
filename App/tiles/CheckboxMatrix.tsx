import React from "react";
import { useTileUpdate } from "./useTileUpdate";
import "./CheckboxMatrix.scss";
import { IDefaultTileProps } from "./DefaultTileProps";
import { EmojiCheckbox, ICheckboxValue } from "./components/EmojiCheckbox";

export type CheckboxMatrixItems = ICheckboxValue[][];

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
      <div className="row column"></div>
      {columnLabels.map(column => <div className="column">{column}</div>)}
      {rowLabels.map((row, rowIndex) => (<>
          <div className="row">{row}</div>
          {columnLabels.map((_, colIndex) => (
             <>
             <div className="cell"><EmojiCheckbox value={values?.[rowIndex]?.[colIndex]} /></div>
           </>
          ))}
        </>
      ))}
    </div>
  );
};
