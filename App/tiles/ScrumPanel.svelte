<script lang="ts">
  import { createTileStores } from "../stores";
  import OptionalLink from "./components/OptionalLink.svelte";

  interface ScrumPanelProps {
    labels: string[];
  }

  interface Card {
    title: string;
    link?: string;
    type?: "story" | "bug";
    epic?: string;
    points?: number;
    color?: string;
    sprint?: string;
    assigned?: {
      image: string;
    };
  }

  type ScrumPanelData = {
    cards: Array<Array<Card>>;
  };

  export let id: string;

  const { getProps, getState } = createTileStores(id);
  const props = getProps<ScrumPanelProps>();
  const state = getState<ScrumPanelData>();
</script>

<div
  class="columns"
  style="grid-template-columns: repeat({$props?.labels?.length || 0}, 1fr);"
>
  {#each $props?.labels || [] as label, index}
    <div>
      <header>{label}</header>
      <div class="list">
        {#each $state?.cards?.[index] || [] as { title, link, epic, points, assigned, color }}
          <div class="card">
            <OptionalLink {link}>
              <div class="card-content">
                <div class="assigned">
                  {#if assigned}
                    <img src={assigned.image} alt="assigned" />
                  {/if}
                </div>
                <div class="title">{title}</div>
                <div class="points">
                  {#if points}{points} {/if}
                </div>
                {#if epic}
                  <div class="content">
                    <div class="epic">
                      {epic}
                    </div>
                  </div>
                {/if}
              </div>
            </OptionalLink>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .columns {
    display: grid;
    flex: 1;
    gap: 10px;
    padding: 0px 10px;
    font-size: 1vw;
    height: 100%;
  }

  header {
    text-align: center;
    padding: 15px;
  }

  .list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .card + .card {
    margin-top: 10px;
  }

  .card {
    width: 100%;
    background-color: #444341;
    border-radius: 10px;
    --padding: 5px;
  }

  .card-content {
    padding: 10px;
    width: 100%;
    position: relative;

    display: grid;
    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: 1fr auto;
    gap: 10px;
    grid-auto-flow: row;
    grid-template-areas:
      ". . ."
      "content content content";
  }

  .content {
    grid-area: content;
  }

  .epic {
    text-align: center;
    padding: var(--padding);
    background-color: #666341;
    border-radius: 10px;
  }

  .assigned,
  .title,
  .points {
    display: flex;
    align-items: center;
  }

  .assigned img {
    width: 32px;
    border-radius: 10px;
  }
</style>
