import type { IAppConfig, ITileState } from "./TileConfig";

// These are the interfaces between the server and the client.

export interface IConfigPayload {
  config: IAppConfig;
}
export type ITileUpdatePayload<T> = ITileState<T>;
