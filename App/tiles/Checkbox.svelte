<script lang="ts">
  import { createTileStores } from "stores";
  import type { ICheckboxValue } from "./Checkbox";
  import EmojiCheckbox from "./components/EmojiCheckbox.svelte";

  export let id: string;

  const { getState } = createTileStores(id);
  const state = getState<ICheckboxValue>();
</script>

<div class="checkbox-tile">
  <EmojiCheckbox checkbox={$state || {value: undefined}}  />
</div>

<style>
  .checkbox-tile {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    font-size: 5em;
  }
</style>
