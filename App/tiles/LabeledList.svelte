<script lang="ts">
  import { createTileStores } from "../stores";
  type LabeledListItem = {
    label: string;
    value: string;
    footer?: string;
  };

  export let id: string;

  const { getState } = createTileStores(id);
  const state = getState<LabeledListItem[]>();
</script>

<div class="labeled-list-tile">
  {#each ($state || []) as { label, value, footer } (label)}
    <div class="item">
      {#if label}
        <div class="label">{label}</div>
      {/if}
      <div class="value">
        <div>{value}</div>
        {#if footer}
          <div class="footer">{footer}</div>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .labeled-list-tile {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }

  .item {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    text-align: center;
    align-items: center;
  }

  .label {
    padding: 0px 5px;
  }

  .value {
    flex: 1;
  }

  .footer {
    font-size: 0.5em;
    flex-basis: 100%;
  }
</style>
