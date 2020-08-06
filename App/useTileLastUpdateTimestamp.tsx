import React, { SetStateAction } from "react";
import { useTileListener } from "./useTileListener";
import { ITileUpdatePayload } from "./socket";

export const useTileLastUpdateTimestamp = (tileId: string, defaultLastTimestamp: number): [number, React.Dispatch<SetStateAction<number>>] => {
    const [value, setValue] = React.useState<number>(defaultLastTimestamp);
    useTileListener(tileId, (payload: ITileUpdatePayload<number>) => {
        setValue(payload.lastTimestamp);
    });
    return [value, setValue];
}