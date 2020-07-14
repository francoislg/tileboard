import * as React from "react";
import "./SquareTile.scss";

export const RectangleTile: React.FunctionComponent = ({children}) => (
    <div className="layout-square rectangle">
        {children}
    </div>
)