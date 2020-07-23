import React from "react";
import { useTileUpdate } from "./useTileUpdate";
import "./Checkbox.scss";
import { IDefaultTileProps } from "./DefaultTileProps";
import { EmojiCheckbox } from "./components/EmojiCheckbox";

export const Checkbox: React.FunctionComponent<IDefaultTileProps<boolean>> = ({
  id,
  initialValue,
}) => {
  const [value, _] = useTileUpdate<boolean | undefined>(id, initialValue);

  return (
    <div className="checkbox-tile">
      <EmojiCheckbox value={value} />
    </div>
  );
};
