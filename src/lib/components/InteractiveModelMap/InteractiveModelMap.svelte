<script lang="ts">
  let L: any = $state();
  onMount(async () => {
    const Leaflet = await import('leaflet');
    L = Leaflet.default;
  })
  import 'leaflet/dist/leaflet.css'
  import type { Map } from 'leaflet';
  
  import { base } from "$app/paths";
	import { onMount } from 'svelte';

	// Pre-projected topojson data, very small file
	import topoJsonData from './regionPolygons';
	import { feature } from 'topojson-client';
	const regionGeoJson = feature(topoJsonData, topoJsonData.objects['region']);
  
  type InteractiveModelMapProps = {
    src: string;
    regionBounds: [[number, number],[number, number]];
  }
  
  let { src, regionBounds }: InteractiveModelMapProps = $props();
  
  let map: Map|null = $state(null);

  function initMap(node: any) {
    const imageUrl = `${base}/assets/maps/${src}`;
    const imageBounds = [[25,-125],[52,-65]];

    map = L.map(node);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.imageOverlay(imageUrl, imageBounds, { opacity: 0.6 }).addTo(map);

    console.log(regionGeoJson);
    L.geoJSON(regionGeoJson, {
      fill: false,
      color: "black",
      weight: 1.2
    }).addTo(map);
  }

  $effect(() => {
    if (map) {
      map.fitBounds(regionBounds);
    }
  })
</script>

{#if L}
  <div class='w-full h-full' use:initMap></div>
{/if}