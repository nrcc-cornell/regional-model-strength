<script lang="ts">
  import InteractiveModelMap from './InteractiveModelMap.svelte';
  import type { Map } from 'leaflet';

  // Pre-projected topojson data, very small file
	import topoJsonData from '$lib/topojson/regionPolygons';
	import { feature } from 'topojson-client';
  const regionGeoJson = feature(topoJsonData, topoJsonData.objects['regions']);
  
  type LinkedInteractiveModelMapsProps = {
    regions: Regions;
    selectedRegion: RegionObjs|null;
    mapSrcs: MapSrc[];
  }

  let { regions, selectedRegion=$bindable(), mapSrcs }: LinkedInteractiveModelMapsProps = $props();
  let mapRefs: (Map|null)[] = $state(mapSrcs.map(_ => null));

  function handleRefChange(newRef: Map, idx: number) {
    mapRefs = [
      ...mapRefs.slice(0, idx),
      newRef,
      ...mapRefs.slice(idx + 1)
    ];

    if (mapRefs.every(ref => ref !== null)) {
      for (let i = 0; i < mapRefs.length; i++) {
        for (let j = 0; j < mapRefs.length; j++) {
          if (i !== j) {
            // @ts-ignore
            mapRefs[i].sync(mapRefs[j]);
          }
        }
      }
    }
  }

  function handleFeatureClick(feature: any) {
    const newRegion = regions.find(r => r.name === feature.properties.region);
    if (newRegion) {
      selectedRegion = newRegion;
    }
  }
</script>

<div class='w-full h-full flex flex-wrap justify-evenly gap-6'>
  {#each mapRefs as ref, i}
    <InteractiveModelMap
      src={mapSrcs[i]}
      bind:selectedRegion
      {regionGeoJson}
      {handleRefChange}
      {handleFeatureClick}
      mapRef={ref}
      id={i}
    />
  {/each}
</div>