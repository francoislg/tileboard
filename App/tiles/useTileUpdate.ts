import { ITileUpdatePayload } from "../socket";
import React, { Dispatch, SetStateAction } from "react";
import { useTileListener } from "../useTileListener";

export const useTileUpdate = <T>(tileId: string, defaultValue: T): [T, React.Dispatch<SetStateAction<T>>] => {
    const [value, setValue] = React.useState<T>(defaultValue as T);
    useTileListener(tileId, (payload: ITileUpdatePayload<T>) => {
        setValue(payload.value);
    });
    return [value, setValue];
}