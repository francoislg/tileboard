import React from "react";
import { useTileUpdate } from "./useTileUpdate";
import "./Checkbox.scss";
import { IDefaultTileProps } from "./DefaultTileProps";

export const Checkbox: React.FunctionComponent<
  IDefaultTileProps<boolean> & { label?: string }
> = ({ id, initialValue, label }) => {
  const [value, _] = useTileUpdate<boolean | undefined>(id, initialValue);

  const valueAsString = `${value}`;

  return (
    <div className="checkbox-tile">
      {!!label && <div>{label}</div>}
      {valueAsString === "true" && <div>✔️</div>}
      {valueAsString === "false" && <div>🔴</div>}
      {valueAsString !== "true" && valueAsString !== "false" && <div>❓</div>}
    </div>
  );
};
