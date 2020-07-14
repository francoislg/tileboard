import * as React from "react";
import "./SquareTile.scss";

export const LargeSquareTile: React.FunctionComponent = ({children}) => (
    <div className="layout-square large">
        {children}
    </div>
)