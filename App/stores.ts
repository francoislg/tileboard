import { derived, writable } from "svelte/store";
import type { IConfigPayload, ITileUpdatePayload } from "./payloads";
import { createSocket } from "./socket";
import type { IAppConfig } from "./TileConfig";

export const appState = writable<IAppConfig>({
  tiles: [],
});

export const createTileStores = (id: string) => {
  const tileStore = derived(appState, (state) => state.tiles.find((tile) => tile.id === id));
  return {
    getProps: <TileProps>() => derived(tileStore, (state) => state?.props as TileProps | undefined),
    getState: <TileState>() => derived(tileStore, (state) => state?.value as TileState | undefined),
  }
}

export const startSocket = () => {
  createSocket({
    supportedMessages: {
      config: (data: IConfigPayload): void => {
        appState.set(data.config);
      },
      tile: (data: ITileUpdatePayload<any>) => {
        appState.update((state) => ({
          ...state,
          tiles: state.tiles.map((tile) =>
            tile.id === data.id
              ? {
                  ...tile,
                  ...data,
                }
              : tile
          ),
        }));
      },
    },
  });
};
