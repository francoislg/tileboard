<script lang="ts">
  import { text } from "svelte/internal";
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
    tags?: Array<{
      text: string;
      color: string;
    }>;
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
        {#each $state?.cards?.[index] || [] as { title, link, epic, points, assigned, color, tags }}
          <div class="card">
            <OptionalLink {link}>
              <div class="card-content">
                <div class="descriptionrow">
                  <div class="assigned">
                    {#if assigned}
                      <img src={assigned.image} alt="assigned" />
                    {/if}
                  </div>
                  <div class="title">{title}</div>
                  <div class="points">
                    {#if points}{points} {/if}
                  </div>
                </div>

                {#if tags && tags.length > 0}
                  <div class="tags">
                    {#each tags as { text, color }}
                      <div class="tag" style="background-color: {color}">
                        {text}
                      </div>
                    {/each}
                  </div>
                {/if}
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
    --margin: 10px;
    --padding: 5px;
  }

  .card-content {
    padding: 10px;
    width: 100%;
    position: relative;

    display: flex;
    flex-direction: column;
  }

  .card-content > div + div {
    margin-top: var(--margin);
  }

  .descriptionrow {
    display: flex;
  }

  .descriptionrow > div + div {
    margin-left: var(--margin);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: -5px;
  }

  .tag {
    text-align: center;
    padding: var(--padding);
    margin: 5px;
    border-radius: 10px;
    flex: 1;
  }

  .content {
    grid-area: content;
  }

  .epic {
    text-align: center;
    padding: var(--padding);
    background-color: #666341;
    border-radius: 5px;
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
