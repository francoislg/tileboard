import React from "react";
import { useTileUpdate } from "./useTileUpdate";
import "./Checkbox.scss";
import { IDefaultTileProps } from "./DefaultTileProps";
import { EmojiCheckbox, ICheckboxValue } from "./components/EmojiCheckbox";

export const Checkbox: React.FunctionComponent<IDefaultTileProps<ICheckboxValue>> = ({
  id,
  initialValue,
}) => {
  const [value, _] = useTileUpdate<ICheckboxValue | undefined>(id, initialValue);

  return (
    <div className="checkbox-tile">
      <EmojiCheckbox value={value} />
    </div>
  );
};
