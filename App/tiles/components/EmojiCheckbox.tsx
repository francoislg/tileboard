import * as React from "react";
import "./EmojiCheckbox.scss";

export type ICheckboxConfiguration = {
  value: undefined | boolean | string;
  link?: string;
};
export type ICheckboxValue = boolean | ICheckboxConfiguration;

export const EmojiCheckbox: React.FunctionComponent<{
  value?: ICheckboxValue;
}> = ({ value: checkboxValue }) => {
  const { value, link } = extractConfigFromValue(checkboxValue);
  const LinkWrapper: React.FunctionComponent = link
    ? ({ children }) => <a href={link} target="_blank" className="link">{children}</a>
    : ({ children }) => <>{children}</>;
  return (
    <span className="checkbox">
      <LinkWrapper>
        {value === "true" && "✔️"}
        {value === "false" && "🔴"}
        {value !== "true" && value !== "false" && "❓"}
      </LinkWrapper>
    </span>
  );
};

const extractConfigFromValue = (
  checkbox: ICheckboxValue
): ICheckboxConfiguration => {
  if (typeof checkbox === "object") {
    return {
      ...checkbox,
      value: `${checkbox.value}`,
    };
  } else {
    return {
      value: `${checkbox}`,
    };
  }
};
