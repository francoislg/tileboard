import * as React from "react";
import "./SquareTile.scss";

export const SquareTile: React.FunctionComponent = ({children}) => (
    <div className="layout-square">
        {children}
    </div>
)