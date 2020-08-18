import React from "react";
import { useTileUpdate } from "./useTileUpdate";
import "./Checkbox.scss";
import { IDefaultTileProps } from "./DefaultTileProps";
import { EmojiCheckbox, ICheckboxValue } from "./components/EmojiCheckbox";

export interface ICheckboxProps {
  coloredBackground?: boolean;
}

export const Checkbox: React.FunctionComponent<IDefaultTileProps<ICheckboxValue> & ICheckboxProps> = ({
  id,
  initialValue,
  coloredBackground
}) => {
  const [value, _] = useTileUpdate<ICheckboxValue | undefined>(id, initialValue);

  return (
    <div className="checkbox-tile">
      <EmojiCheckbox value={value} coloredBackground={coloredBackground} />
    </div>
  );
};
