<script>
  import { appState, currentPage } from "stores";
  import { derived } from "svelte/store";

  const nbPages = derived(appState, (state) =>
    state.tiles.reduce((max, tile) => Math.max(max, tile.page || 1), 1)
  );

  function nextPage() {
    $currentPage = Math.min($currentPage + 1, $nbPages);
  }

  function previousPage() {
    $currentPage = Math.max($currentPage - 1, 1);
  }

  function onKeyDown(e) {
    console.log(e);
    if (e.key === "ArrowLeft") {
      previousPage();
    } else if (e.key === "ArrowRight") {
      nextPage();
    }
  }
</script>

{#if $nbPages > 1}
  <div class="controls">
    <button class="hidden" class:shown={$currentPage > 1} on:click={previousPage}>👈️</button>
    <button class="hidden" class:shown={$currentPage < $nbPages} on:click={nextPage}>👉️</button>

  </div>
{/if}

<svelte:window on:keydown={onKeyDown} />

<style>
  .controls {
    position: fixed;
    right: 0px;
    bottom: 0px;
  }

  .hidden {
		opacity: 0;
		pointer-events: none;
	}

	.hidden.shown {
		opacity: 1;
		pointer-events: all;
	}
</style>
