import * as React from "react";
import "./EmojiCheckbox.scss";

export type ICheckboxConfiguration = {
  value: undefined | boolean | string;
  link?: string;
  isUpdating?: boolean;
  coloredBackground?: boolean;
};
export type ICheckboxValue = boolean | ICheckboxConfiguration;
export interface IEmojiCheckboxProps {
  value?: ICheckboxValue;
  coloredBackground?: boolean;
}

export const EmojiCheckbox: React.FunctionComponent<IEmojiCheckboxProps> = (
  props
) => {
  const { value, link, isUpdating, coloredBackground } = extractConfigFromProps(
    props
  );
  const LinkWrapper: React.FunctionComponent = link
    ? ({ children }) => (
        <a href={link} target="_blank" className="link">
          {children}
        </a>
      )
    : ({ children }) => <>{children}</>;
  return (
    <div className={`checkbox-container ${coloredBackground ? value : ""}`}>
      <LinkWrapper>
        <div className="checkbox">
          {isUpdating && <span className="updating">⌛</span>}
          {value === "true" && "👍"}
          {value === "false" && "🔴"}
          {value !== "true" && value !== "false" && "❓"}
        </div>
      </LinkWrapper>
    </div>
  );
};

const extractConfigFromProps = ({
  value: checkbox,
  coloredBackground,
}: IEmojiCheckboxProps): ICheckboxConfiguration => {
  if (typeof checkbox === "object") {
    return {
      coloredBackground,
      ...checkbox,
      value: `${checkbox.value}`,
    };
  } else {
    return {
      coloredBackground,
      value: `${checkbox}`,
    };
  }
};
