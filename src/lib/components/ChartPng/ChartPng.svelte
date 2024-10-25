<script lang="ts">
  import { base } from "$app/paths";
  
  type ChartPngProps = {
    selectedRegion: Regions|null;
  }

  let { selectedRegion }: ChartPngProps = $props();
  let src: string|null = $state(null);
  $effect(() => {
    src = selectedRegion === null ? null : `${base}/assets/charts/${selectedRegion.toLowerCase().split(' ').join('_').replace('_and_caribbean','')}_region_max_livneh_nclimgrid.png`
  });
</script>

<div>
  {#if src}
    <img
      {src}
      alt={`${selectedRegion} chart png`}
    />
  {/if}
</div>