<script lang="ts">
  import { base } from "$app/paths";
  
  type ChartPngProps = {
    selectedRegion: RegionObjs;
    selectedCell: SelectedCellData;
  }

  let { selectedRegion, selectedCell }: ChartPngProps = $props();
  let chartSrc = $state('');

  $effect(() => {
    chartSrc = selectedRegion.dataKey === 'northeast' ? `${selectedCell.row.dataKey}_time_series_obs_${selectedCell.product.dataKey}_${selectedRegion.dataKey}.png` : `${selectedCell.row.dataKey}_time_series_obs_${selectedCell.product.dataKey}_${selectedRegion.dataKey}.pngxxx`;
  });

  function handleError() {
    chartSrc = '';
  }

  $inspect(chartSrc);
</script>

<div class='w-1/2 min-w-96'>
  {#if chartSrc === ''}
    <div class='w-full aspect-video m-auto text bg-gray-100 text-gray-700 italic flex justify-center items-center'>
      <span>There is no chart for this selection</span>
    </div>
  {:else}
    <img
      src={`${base}/assets/charts/${chartSrc}`}
      alt='Chart for the selection'
      onerror={handleError}
    />
  {/if}
</div>