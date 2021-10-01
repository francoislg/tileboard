<script lang="ts">
  import { appState } from "../stores";
  import Title from "./components/Title.svelte";

  export let width = 1;
  export let height = 1;
  export let breakLayout: boolean = false;
  export let title: string;
  export let rectangle: boolean = false;
  export let large: boolean = false;

  let styles = [
    breakLayout && $appState.direction === "column"
      ? "grid-row-start: 1; "
      : "",
    breakLayout && $appState.direction === "row" ? "grid-column-start: 1" : "",
  ]
    .filter((s) => !!s)
    .join(" ");
</script>

<div
  class="layout-rectangle"
  class:rectangle
  class:large
  style="grid-column-end: span {width}; grid-row-end: span {height}; {styles}"
>
  <Title {title} />
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .layout-rectangle {
    position: relative;

    height: 100%;
    width: 100%;
    grid-row-end: span 1;

    background-color: #25282d;

    display: grid;
    grid-template-rows: min-content 1fr;

    overflow: hidden;
  }

  .rectangle {
    grid-column-end: span 2;
  }

  .large {
    grid-column-end: span 2;
    grid-row-end: span 2;
  }

  .content {
    display: flex;
    overflow: auto;
  }
</style>
