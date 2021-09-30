<script lang="ts">
  import RectangleTile from "./layout/RectangleTile.svelte";

  export let timeInMs: number;
  export let title: string = "";
  export let layout: string | undefined = undefined;
  export let layoutProps: any;
  export let lastTimestamp: number;

  $: lastTimestamp && resetTimeout();

  let timeoutInstance: any;
  let timeoutReached = false;

  function resetTimeout() {
    const timeUntilTimeout = lastTimestamp
      ? Math.max(lastTimestamp + timeInMs - Date.now(), 0)
      : 0;
    timeoutReached = false;
    clearTimeout(timeoutInstance);
    timeoutInstance = globalThis.setTimeout(() => {
      timeoutReached = true;
    }, timeUntilTimeout);
  }

  const specificLayoutProps: {
    [name: string]: { width?: number; height?: number };
  } = {
    rectangle: {
      width: 2,
    },
    large: {
      width: 2,
      height: 2,
    },
    square: {},
  };
</script>

<RectangleTile
  {title}
  breakLayout={layoutProps?.breakLayout || layoutProps?.break}
  {...layoutProps}
  {...specificLayoutProps[layout?.toLowerCase() || "square"] || {}}
>
  {#if timeoutReached}
    <div class="timeout-overlay">
      <div>Timeout reached</div>
      <div>⌛</div>
    </div>
  {:else}
    <slot />
  {/if}
</RectangleTile>

<style>
  .timeout-overlay {
    display: flex;
    flex: 1;
    text-align: center;
    justify-content: space-evenly;
    font-size: 2em;
    flex-direction: column;
  }
</style>
