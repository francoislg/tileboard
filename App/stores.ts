import { derived, writable } from "svelte/store";
import type { IConfigPayload, ITileUpdatePayload } from "./payloads";
import { createSocket } from "./socket";
import type { IAppConfig } from "./TileConfig";

const initialPage = window.location.hash.substring(1).split("&").map(a => a.split("=")).find(([key]) => key === 'page')?.[1] || "1";

export const currentPage = writable<number>(parseInt(initialPage));

currentPage.subscribe((page) => window.location.hash = `#page=${page}`)

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
