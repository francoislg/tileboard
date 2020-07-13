import React from "react";
import { useTileUpdate } from "./useTileUpdate";

export const Checkbox: React.FunctionComponent<{id: string, initialValue?: boolean, label?: string}> = ({id, initialValue, label}) => {
    const [value, _] = useTileUpdate<boolean | undefined>(id, initialValue);

    const valueAsString = `${value}`;

    return  <div style={{display: "flex", flexDirection: 'column', alignItems: 'center'}}>
        {!!label && <div>{label}</div>}
        {valueAsString === "true" && <div>✔️</div>}
        {valueAsString === "false" && <div>🔴</div>}
        {valueAsString !== "true" && valueAsString !== "false" && <div>❓</div>}
    </div>
}