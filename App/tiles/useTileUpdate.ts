import { ITileUpdatePayload } from "../socket";
import React from "react";
import { useTileListener } from "../useTileListener";

export const useTileUpdate = <T>(tileId: string, defaultValue: T) => {
    const [value, setValue] = React.useState<T>(defaultValue);
    useTileListener(tileId, (payload: ITileUpdatePayload<T>) => {
        setValue(payload.value);
    });
    return [value, setValue];
}