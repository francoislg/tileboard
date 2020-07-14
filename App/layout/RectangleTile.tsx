import * as React from "react";
import "./RectangleTile.scss";
import { IDefaultLayoutProps } from "./DefaultLayoutProps";

export const RectangleTile: React.FunctionComponent<IDefaultLayoutProps> = ({
  width = 1,
  height = 1,
  children,
}) => (
  <div
    style={{ gridColumnEnd: `span ${width}`, gridRowEnd: `span ${height}` }}
    className="layout-rectangle"
  >
    {children}
  </div>
);
