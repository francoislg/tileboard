<script lang="ts">
  import type { ICheckboxValue } from "../Checkbox";

  import OptionalLink from "./OptionalLink.svelte";

  export let checkbox: ICheckboxValue;
  export let coloredBackground: boolean = false;

  $: value = typeof checkbox === "object" ? `${checkbox.value}` : `${checkbox}`;
  $: isUpdating = typeof checkbox === "object" ? checkbox.isUpdating : false;
  $: link = typeof checkbox === "object" ? checkbox.link : undefined;
  $: useColoredBackground = coloredBackground || (typeof checkbox === "object" ? checkbox.coloredBackground : false);
</script>

<div class={`checkbox-container ${useColoredBackground ? value : ""}`}>
  <OptionalLink {link}>
    <div class="checkbox">
      {#if isUpdating}
        <span class="updating">⌛</span>
      {/if}
      {#if value === "true"}
        👍
      {:else if value === "false"}
        🔴
      {:else}
        ❓
      {/if}
    </div>
  </OptionalLink>
</div>

<style>
  .checkbox-container {
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .true {
    background-color: green;
  }

  .false {
    background-color: darkred;
  }

  .checkbox {
    position: relative;
  }

  .updating {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 0.5em;
  }
</style>
