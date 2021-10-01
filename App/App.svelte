<script lang="ts">
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import LayoutWithTimeout from "./LayoutWithTimeout.svelte";
  import PageControls from "./PageControls.svelte";

  import { appState, currentPage, startSocket } from "./stores";
  import Checkbox from "./tiles/Checkbox.svelte";
  import CheckboxMatrix from "./tiles/CheckboxMatrix.svelte";
  import InvalidType from "./tiles/InvalidType.svelte";
  import LabeledList from "./tiles/LabeledList.svelte";
  import LineChart from "./tiles/LineChart.svelte";
  import ScrumPanel from "./tiles/ScrumPanel.svelte";

  const tiles = derived(
    [appState, currentPage],
    ([state, page]) =>
      state?.tiles?.filter((tile) => (tile.page || 1) === page) || []
  );
  const direction = derived(
    [appState, currentPage],
    ([state, page]) =>
       state?.pagesConfig?.[page - 1]?.direction || state?.direction || "column"
  );
  const defaultTimeout = derived(
    [appState, currentPage],
    ([state, page]) =>
       state?.pagesConfig?.[page - 1]?.defaultTimeout || state?.defaultTimeout || 120000
  );

  onMount(() => {
    startSocket();
  });
</script>

<div class="background container {$direction}">
  {#each $tiles as { id, key, title, type, layout, layoutProps, lastTimestamp, timeout } (key || id)}
    <LayoutWithTimeout
      {title}
      {layout}
      {layoutProps}
      {lastTimestamp}
      timeInMs={timeout || $defaultTimeout}
    >
      {#if type.toLowerCase() === "labeledlist"}
        <LabeledList {id} />
      {:else if type.toLowerCase() === "checkbox"}
        <Checkbox {id} />
      {:else if type.toLowerCase() === "checkboxmatrix"}
        <CheckboxMatrix {id} />
      {:else if type.toLowerCase() === "linechart"}
        <LineChart {id} />
      {:else if type.toLowerCase() === "scrumpanel"}
        <ScrumPanel {id} />
      {:else}
        <InvalidType />
      {/if}
    </LayoutWithTimeout>
  {/each}
  <PageControls />
</div>

<style>
  :global(html, body, #root) {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  :global(body) {
    background: #1c1d1f;
    color: #c7cbd2;
    font-family: "misolight", "Trebuchet MS", Arial, sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .background {
    background-color: darkgray;
    width: 100%;
    height: 100%;
    padding: 5px;
  }

  .container {
    display: grid;
    grid-gap: 5px;
    grid-template-columns: repeat(8, minmax(80px, 1fr));
    grid-template-rows: repeat(4, minmax(80px, 1fr));

    font-size: 1.3vw;
  }

  .row {
    grid-auto-flow: row;
  }

  .column {
    grid-auto-flow: column;
  }
</style>
