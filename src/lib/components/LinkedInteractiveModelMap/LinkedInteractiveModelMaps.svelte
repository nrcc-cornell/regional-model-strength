<script lang="ts">
  import InteractiveModelMap from './InteractiveModelMap.svelte';
  import type { Map, LatLngBounds } from 'leaflet';

  // Pre-projected topojson data, very small file
	import topoJsonData from '$lib/topojson/regionPolygons';
	import { feature } from 'topojson-client';
  const regionGeoJson = feature(topoJsonData, topoJsonData.objects['regions']);
  
  type LinkedInteractiveModelMapsProps = {
    regionBounds: LatLngBounds;
    selectedRegion: Regions|null;
    mapsInfo: { src:string; }[];
  }

  type MapStatus = {
    ref: Map|null;
    src: string;
  }
  
  let { mapsInfo, regionBounds, selectedRegion=$bindable() }: LinkedInteractiveModelMapsProps = $props();
  let mapStatuses: MapStatus[] = $state(mapsInfo.map(({ src }) => ({ ref: null, src })));

  function handleRefChange(newRef: Map, idx: number) {
    mapStatuses = [
      ...mapStatuses.slice(0, idx),
      {
        ...mapStatuses[idx],
        ref: newRef
      },
      ...mapStatuses.slice(idx + 1)
    ];

    if (mapStatuses.every(ms => ms.ref !== null)) {
      for (let i = 0; i < mapStatuses.length; i++) {
        for (let j = 0; j < mapStatuses.length; j++) {
          if (i !== j) {
            // @ts-ignore
            mapStatuses[i].ref.sync(mapStatuses[j].ref);
          }
        }
      }
    }
  }
</script>

<div class='w-full h-full flex flex-wrap justify-evenly gap-6'>
  {#each mapStatuses as { src, ref }, i}
    <InteractiveModelMap
      {src}
      {regionBounds}
      bind:selectedRegion
      {regionGeoJson}
      {handleRefChange}
      mapRef={ref}
      id={i}
    />
  {/each}
</div>