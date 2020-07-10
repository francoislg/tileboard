import { getSocket, ITileUpdatePayload, MessagesTypes } from "../socket";
import React from "react";

export const useTileUpdate = <T>(tileId: string, defaultValue: T) => {
    const [value, setValue] = React.useState<T>(defaultValue);
    React.useEffect(() => {
        const listener = (payload: ITileUpdatePayload<T>) => {
            if (payload.id === tileId) {
                setValue(payload.value);
            }
        };
        const socket = getSocket();

        socket.on(MessagesTypes.TILE_UPDATE, listener);
        return () => {
            socket.off(MessagesTypes.TILE_UPDATE, listener)
        }
    });

    return [value, setValue];
}