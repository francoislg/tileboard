import * as React from "react";
import "./RectangleTile.scss";
import { IDefaultLayoutProps } from "./DefaultLayoutProps";
import { Title } from "./components/Title";

export const RectangleTile: React.FunctionComponent<IDefaultLayoutProps> = ({
  width = 1,
  height = 1,
  title,
  children,
}) => (
  <div
    style={{ gridColumnEnd: `span ${width}`, gridRowEnd: `span ${height}` }}
    className="layout-rectangle"
  >
    <Title title={title} />
    <div className="content">{children}</div>
  </div>
);
