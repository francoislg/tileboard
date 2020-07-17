
import io from "socket.io-client";
import { IAppConfig } from "./TileConfig";

export const PORT = process.env.SOCKET_PORT || 7273;
let socket: ReturnType<typeof io>;
export const getSocket = () => socket || (socket = io(`http://localhost:${PORT}`));
export const MessagesTypes = {
    CONFIG: 'config',
    TILE_UPDATE: 'tile'
}
export interface IConfigPayload {
    config: IAppConfig;
}
export interface ITileUpdatePayload<T> {
    id: string;
    value: T;
}
