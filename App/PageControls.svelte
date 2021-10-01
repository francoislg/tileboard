<script>
  import { appState, currentPage } from "stores";
  import { derived } from "svelte/store";

  const nbPages = derived(appState, (state) =>
    state.tiles.reduce((max, tile) => Math.max(max, tile.page || 1), 1)
  );
</script>

{#if $nbPages > 1}
  <div class="controls">
    {#if $currentPage < $nbPages}
      <button on:click={() => $currentPage++}>👉️</button>
    {/if}
    {#if $currentPage > 1}
      <button on:click={() => $currentPage--}>👈️</button>
    {/if}
  </div>
{/if}

<style>
  .controls {
    position: fixed;
    right: 0px;
    bottom: 0px;
  }
</style>
