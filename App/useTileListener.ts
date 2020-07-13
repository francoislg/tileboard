import { getSocket, ITileUpdatePayload, MessagesTypes } from "./socket";
import React from "react";

export const useTileListener = <T>(tileId: string, listener: (payload: ITileUpdatePayload<T>) => void) => {
    useTileUpdateSocket((payload: ITileUpdatePayload<T>) => {
        payload.id === tileId && listener(payload);
    });
}

const useTileUpdateSocket = <T>(listener: (payload: ITileUpdatePayload<T>) => void) =>  {
    React.useEffect(() => {
        const socket = getSocket();
        socket.on(MessagesTypes.TILE_UPDATE, listener);
        return () => {
            socket.off(MessagesTypes.TILE_UPDATE, listener)
        }
    });
}