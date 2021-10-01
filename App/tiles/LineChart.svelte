<script lang="ts">
  import { createTileStores } from "../stores";
  import * as Pancake from "@sveltejs/pancake";
  import { derived } from "svelte/store";
import LabeledList from "./LabeledList.svelte";

  interface LineChartProps {
    labels?: string[];
  }

  type LineChartData = {
    labels?: string[];
    datasets: Array<{
      name?: string;
      color?: string;
      values: number[];
    }>;
  };

  export let id: string;

  const COLOR_ROTATION = ["#ff3e00", "blue", "green"];

  const { getProps, getState } = createTileStores(id);
  const props = getProps<LineChartProps>();
  const state = getState<LineChartData>();

  const data = derived([props, state], ([p, s]) => ({
    labels: s?.labels || p?.labels || [],
    datasets: s?.datasets?.map((dataset, index) => ({
      ...dataset,
      color: dataset?.color || COLOR_ROTATION[index % COLOR_ROTATION.length],
    })) || [],
  }));

  const computed = derived(data, (d) =>
    d.datasets
      .flatMap((s) => s.values)
      .reduce(
        (prev, s) => ({
          min: Math.min(prev.min, s),
          max: Math.max(prev.max, s),
        }),
        {
          min: 13509130513,
          max: 0,
        }
      )
  );


  const minx = 0;
  const maxx = $data.labels.length - 1;

  const pc = (date) => {
    return (100 * (date - minx)) / (maxx - minx);
  };
</script>

<div class="chart">
  <Pancake.Chart x1={minx} x2={maxx} y1={0} y2={$computed.max}>
    <Pancake.Grid horizontal count={5} let:value let:last>
      {#if value !== 0}<div class="grid-line horizontal">
          <span>{value}</span>
        </div>{/if}
    </Pancake.Grid>

    <Pancake.Grid vertical count={5} let:value>
      <div class="grid-line vertical" />

      <span class="date-label">
        {$data?.labels?.[value]?.substring(5, 10)}
      </span>
    </Pancake.Grid>

    <Pancake.Svg>
      {#each $data.datasets as { color, values }, index}
        <Pancake.SvgLine
          data={values.map((v, index) => ({ value: v, index }))}
          x={(d) => d.index}
          y={(d) => d.value}
          let:d
        >
          <path
            stroke={color}
            class="trend"
            {d}
          />
        </Pancake.SvgLine>
      {/each}
    </Pancake.Svg>

    <div class="legend">
      {#each $data.datasets as { color, name }}
        <div style="color: {color};">{name}</div>
      {/each}
    </div>

    {#each $data.datasets as { color, values }, index}
      <Pancake.Quadtree
        data={values.map((v, index) => ({ value: v, index }))}
        x={(d) => d.index}
        y={(d) => d.value}
        let:closest
      >
        {#if closest}
          <Pancake.Point x={closest.index} y={closest.value} let:d>
            <div class="focus" />
            <div
              class="tooltip"
              style="color: {color}; transform: translate(-{pc(closest.index)}%,0)"
            >
              <strong>{Math.floor(closest.value)}</strong>
            </div>
          </Pancake.Point>
        {/if}
      </Pancake.Quadtree>
    {/each}
  </Pancake.Chart>
</div>

<style>
  .chart {
    box-sizing: border-box;
    height: 100%;
    padding: 16px 32px;
    padding-bottom: 32px;
    width: 100%;
    margin: 0 auto;
  }

  .grid-line {
    position: relative;
    display: block;
    --border-color: #666666;
  }

  .grid-line.horizontal {
    width: calc(100% + 2em);
    left: -2em;
    border-bottom: 1px dashed var(--border-color);
    font-size: 12px;
  }

  .grid-line.vertical {
    height: 100%;
    border-left: 1px dashed var(--border-color);
  }

  path.trend {
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2px;
    fill: none;
  }

  .date-label {
    position: absolute;
    white-space: nowrap;
    width: 4em;
    left: -2em;
    font-family: sans-serif;
    font-size: 14px;
    color: #999;
    text-align: center;
  }

  .focus {
    position: absolute;
    width: 10px;
    height: 10px;
    left: -5px;
    top: -5px;
    border: 1px solid black;
    border-radius: 50%;
    box-sizing: border-box;
  }
  .tooltip {
    position: absolute;
    white-space: nowrap;
    width: 8em;
    bottom: 1em;
    /* background-color: white; */
    line-height: 1;
  }

  .tooltip strong {
    font-size: 1.4em;
    display: block;
  }

  .legend {
    border-radius: 5px;
    background-color: #ffffff;
    padding: 5px;
    position: absolute;
    display: flex;
    white-space: nowrap;
    flex-wrap: wrap;
    font-weight: bold;
    right: 0;
    flex-direction: column;
    font-size: 1rem;
  }
</style>
