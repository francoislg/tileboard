<script lang="ts">
  import { createTileStores } from "stores";
  import { derived } from "svelte/store";
  import type { ICheckboxValue } from "./Checkbox";
  import EmojiCheckbox from "./components/EmojiCheckbox.svelte";

  export let id: string;

  const { getProps, getState } = createTileStores(id);
  const state = getState<ICheckboxValue[][]>();
  const props = getProps<{
    columnLabels: string[];
    rowLabels: string[];
    coloredBackground?: boolean;
  }>();

  const columnLabels = derived(props, (p) => p?.columnLabels || []);
  const rowLabels = derived(props, (p) => p?.rowLabels || []);
  const coloredBackground = derived(
    props,
    (p) => p?.coloredBackground || false
  );
</script>

<div
  class="checkbox-matrix-tile"
  style="grid-template-columns: 1fr repeat({$columnLabels.length}, 1fr); grid-template-rows: 1fr repeat({$rowLabels.length}, 1fr)"
>
  <div class="row column" />
  {#each $columnLabels as column}
    <div class="column">{column}</div>
  {/each}
  {#each $rowLabels as row, rowIndex}
    <div class="row">{row}</div>
    {#each $columnLabels as _, colIndex}
      <div class="cell">
        <EmojiCheckbox
          checkbox={$state?.[rowIndex]?.[colIndex] || { value: undefined }}
          {coloredBackground}
        />
      </div>
    {/each}
  {/each}
</div>

<style>
  .checkbox-matrix-tile {
    display: grid;
    grid-gap: 5px;
    padding: 10px;
    flex: 1;
  }

  div {
    grid-column-end: span 1;
    grid-row-end: span 1;
    display: flex;
  }

  .row {
    align-items: center;
  }

  .column {
    justify-content: center;
  }

  .cell {
    align-items: center;
    justify-content: center;

    border-radius: 5px;
    overflow: hidden;
  }
</style>
