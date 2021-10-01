<script lang="ts">
  import { createTileStores } from "../stores";
  import Chart from "svelte-frappe-charts";
  import { derived } from "svelte/store";

  interface LineChartProps {
    labels?: string[];
  }

  type LineChartData = {
    labels?: string[];
    datasets: Array<{
      values: number[];
    }>;
  };

  export let id: string;

  const { getProps, getState } = createTileStores(id);
  const props = getProps<LineChartProps>();
  const state = getState<LineChartData>();

  const data = derived([props, state], ([p, s]) => ({
    labels: s?.labels || p?.labels || ["a", "b"],
    datasets: s?.datasets || [],
  }));
</script>

<div class="chart-hack">
  {#key $data.labels.length}
    <Chart class="chart-hack" data={$data} type="line" width="100%" />
  {/key}
</div>

<style>
  :global(.chart-hack, .chart-hack > div) {
    width: 100%;
    height: 100%;
  }
</style>
