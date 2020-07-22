import React from "react";
import { useTileUpdate } from "./useTileUpdate";
import "./LabeledList.scss";
import { IDefaultTileProps } from "./DefaultTileProps";

export type LabeledListItem = {
  label: string;
  value: string;
};

export const LabeledList: React.FunctionComponent<IDefaultTileProps<
  LabeledListItem[]
>> = ({ id, initialValue }) => {
  const [values, _] = useTileUpdate<LabeledListItem[]>(id, initialValue || []);

  return (
    <div className="labeled-list-tile">
      {values.map(({ label, value }) => (
        <div className="item" key={label}>
          <div className="label">{label}</div>
          <div className="value">{value}</div>
        </div>
      ))}
    </div>
  );
};
