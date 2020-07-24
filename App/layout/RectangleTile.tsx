import * as React from "react";
import "./RectangleTile.scss";
import { IDefaultLayoutProps } from "./DefaultLayoutProps";
import { Title } from "./components/Title";

export const RectangleTile: React.FunctionComponent<IDefaultLayoutProps> = ({
  appConfig,
  width = 1,
  height = 1,
  break: shouldBreak = false,
  title,
  children,
}) => (
  <div
    style={{
      gridColumnEnd: `span ${width}`,
      gridRowEnd: `span ${height}`,
      ...(shouldBreak && appConfig.direction === 'column' ? { gridRowStart: 1 } : {}),
      ...(shouldBreak && appConfig.direction === 'row' ? { gridColumnStart: 1 } : {}),
    }}
    className="layout-rectangle"
  >
    <Title title={title} />
    <div className="content">{children}</div>
  </div>
);
