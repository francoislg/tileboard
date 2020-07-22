import * as React from "react";
import "./Title.scss";

export const Title: React.FunctionComponent<{ title?: string }> = ({
  title,
}) => <>{title && <div className="tile-title">{title}</div>}</>;
