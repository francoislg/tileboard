
import io from "socket.io-client";
import { IAppConfig } from "./TileConfig";

export const PORT = 3001;
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
