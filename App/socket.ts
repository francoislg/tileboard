
import io from "socket.io-client";
import { IAppConfig } from "./TileConfig";

export const SOCKET_URL = `http://${globalThis.location?.hostname || "0.0.0.0"}`;
export const SOCKET_PORT = 7273;
let socket: ReturnType<typeof io>;
export const getSocket = () => socket || (socket = io(`${SOCKET_URL}:${SOCKET_PORT}`));
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
