import React from "react";
import { useTileUpdate } from "./useTileUpdate";
import "./Checkbox.scss";
import { IDefaultTileProps } from "./DefaultTileProps";

export const Checkbox: React.FunctionComponent<IDefaultTileProps<boolean>> = ({
  id,
  initialValue,
}) => {
  const [value, _] = useTileUpdate<boolean | undefined>(id, initialValue);

  const valueAsString = `${value}`;

  return (
    <div className="checkbox-tile">
      {valueAsString === "true" && "✔️"}
      {valueAsString === "false" && "🔴"}
      {valueAsString !== "true" && valueAsString !== "false" && "❓"}
    </div>
  );
};
