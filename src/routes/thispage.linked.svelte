<script lang="ts">
  import { regions } from "$lib/constants";
  import LinkedInteractiveModelMaps from "$lib/components/InteractiveModelMap/LinkedInteractiveModelMaps.svelte";
	import type { LatLngBounds } from "leaflet";

  let selectedRegion: Regions|null = $state('Northeast');

  const mapsInfo = [{
    src: 'fake_map.png'
  },{
    src: 'loca_rx1dayMean_downscale_bias_map.png'
  },{
    src: 'loca_rx1dayMax_downscale_bias_map.png'
  }];
</script>

<div class='p-4 overflow-y-auto' style='width:1200px;height:600px;'>
  <LinkedInteractiveModelMaps
    regionBounds={(regions.find(r => r.name === selectedRegion) || { name: null, bounds: [[25,-125],[52,-65]] }).bounds as unknown as LatLngBounds}
    bind:selectedRegion
    {mapsInfo}
  />
</div>