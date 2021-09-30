<script lang="ts">
  export let link: string | undefined;
</script>

{#if link}
  <a href={link} target="_blank" class="link">
    <slot />
  </a>
{:else}
  <slot />
{/if}

<style>
  .link {
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }
</style>
