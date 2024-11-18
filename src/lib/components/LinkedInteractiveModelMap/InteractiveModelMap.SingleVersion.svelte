<script lang="ts">
  let L: any = $state();
  onMount(async () => {
    const Leaflet = await import('leaflet');
    L = Leaflet.default;
  })
  import 'leaflet/dist/leaflet.css'
  import type { Map, GeoJSON, ImageOverlay } from 'leaflet';
  
  import { base } from "$app/paths";
	import { onMount } from 'svelte';

	// Pre-projected topojson data, very small file
	import topoJsonData from '$lib/topojson/regionPolygons';
	import { feature } from 'topojson-client';
	const regionGeoJson = feature(topoJsonData, topoJsonData.objects['regions']);
  
  type InteractiveModelMapProps = {
    src: string;
    regionBounds: [[number, number],[number, number]];
    selectedRegion: Regions|null;
  }
  
  let { src, regionBounds, selectedRegion=$bindable() }: InteractiveModelMapProps = $props();
  
  let map: Map|null = $state(null);
  let geoJsonLayer: GeoJSON|null = $state(null);
  let imageOverlay: ImageOverlay|null = $state(null);
  let imageUrl: string = $state('');

  function initMap(node: any) {
    map = L.map(node);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    geoJsonLayer = L.geoJSON(regionGeoJson, {
      color: "black",
      weight: 1.2,
      fillColor: "black",
      onEachFeature: (feature: any, layer: any) => {
        layer.on({ click: () => selectedRegion = feature.properties.region });
        L.marker(layer.getBounds().getCenter(), {
          icon: L.divIcon({
            className: 'map-label',
            html: feature.properties.region,
            iconSize: [100, 40]
          })
        }).addTo(map);
      }
    });
    if (geoJsonLayer !== null && map !== null) {
      geoJsonLayer.addTo(map);
    }
  }

  $effect(() => {
    if (map) {
      map.fitBounds(regionBounds, { padding: [-10, -10] });
    }
  })

  $effect(() => {
    if (geoJsonLayer && selectedRegion) {
      geoJsonLayer.eachLayer((layer: any) => {
        layer.setStyle({ fill: layer.feature.properties.region !== selectedRegion });
      });
    }
  })

  $effect(() => {
    if (src && map !== null) {
      const newImageUrl = `${base}/assets/maps/${src}`;
      if (newImageUrl !== imageUrl) {
        const imageBounds = src === 'fake_map.png' ? [[25,-125],[52,-65]] : [[24,-125],[52,-65]];
        imageUrl = newImageUrl;
        
        if (imageOverlay !== null) {
          imageOverlay.remove();
        }
        
        imageOverlay = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.6 });
        if (imageOverlay !== null && map !== null) {
          imageOverlay.addTo(map);
        }
      }
    }
  })
</script>

{#if L}
  <div class='h-full w-full flex flex-col justify-center gap-1'>
    <div class='w-full h-5/6' use:initMap></div>
    <img class='h-fit' src={`${base}/assets/maps/${imageUrl.includes('fake_map.png') ? 'fake_legend.png' : 'downscale_bias_legend.png'}`} alt='Legend for leaflet map' />
  </div>
{/if}