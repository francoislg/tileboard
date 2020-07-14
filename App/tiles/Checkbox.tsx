import React from "react";
import { useTileUpdate } from "./useTileUpdate";
import "./Checkbox.scss"

export const Checkbox: React.FunctionComponent<{id: string, initialValue?: boolean, label?: string}> = ({id, initialValue, label}) => {
    const [value, _] = useTileUpdate<boolean | undefined>(id, initialValue);

    const valueAsString = `${value}`;

    return  <div className="checkbox-tile">
        {!!label && <div>{label}</div>}
        {valueAsString === "true" && <div>✔️</div>}
        {valueAsString === "false" && <div>🔴</div>}
        {valueAsString !== "true" && valueAsString !== "false" && <div>❓</div>}
    </div>
}