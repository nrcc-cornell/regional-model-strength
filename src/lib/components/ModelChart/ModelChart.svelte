<script lang="ts">
  import { LayerCake, Svg, Html } from 'layercake';
  import Line from './Line.svelte';
  import Area from './Area.svelte';
  import AxisX from './AxisX.svelte';
  import AxisY from './AxisY.svelte';
  import QuadTree from './QuadTree.svelte';

  type DataPoint = { x: (string|number), y: number };

  type ModelChartProps = {
    data: DataPoint[];
  }

  let { data }: ModelChartProps = $props();
</script>

<div class="chart-container">
  <LayerCake
    padding={{ top: 8, right: 10, bottom: 20, left: 25 }}
    x='x'
    y='y'
    yDomain={[0, null]}
    {data}
  >
    <Svg>
      <AxisX />
      <AxisY ticks={4} />
      <Line />
      <Area />
    </Svg>

    <Html>
      <QuadTree />
    </Html>
  </LayerCake>
</div>

<style>
  .chart-container {
    width: 100%;
    height: 250px;
  }
</style>