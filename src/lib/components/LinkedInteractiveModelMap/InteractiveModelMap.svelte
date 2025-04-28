<script lang="ts">
  let L: any = $state();
  onMount(async () => {
    const addSyncToLeaflet = await import('./L.Map.Sync');
    const Leaflet = await import('leaflet');
    L = Leaflet.default;
    addSyncToLeaflet.default(L);
  })
  import 'leaflet/dist/leaflet.css'
  import type { Map, GeoJSON, ImageOverlay, LatLngBounds } from 'leaflet';
  import type { feature } from 'topojson-client';
  
	import { onMount } from 'svelte';
  import { base } from "$app/paths";
  
  type InteractiveModelMapProps = {
    src: MapSrc;
    selectedRegion: RegionObjs|null;
    regionGeoJson: ReturnType<typeof feature>;
    mapRef: Map|null;
    handleRefChange: (a: Map, b: number) => void;
    handleFeatureClick: (x: any) => any;
    id: number;
  }
  
  let {
    src,
    selectedRegion=$bindable(),
    regionGeoJson,
    mapRef=$bindable(),
    handleRefChange,
    handleFeatureClick,
    id
  }: InteractiveModelMapProps = $props();
  
  let geoJsonLayer: GeoJSON|null = $state(null);
  let imageOverlay: ImageOverlay|null = $state(null);
  let imageUrl: string = $state('');

  function initMap(node: any) {
    mapRef = L.map(node, {
      zoomControl: false,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef);

    geoJsonLayer = L.geoJSON(regionGeoJson, {
      color: "black",
      weight: 1.2,
      fillColor: "black",
      onEachFeature: (feature: any, layer: any) => {
        layer.on({ click: () => handleFeatureClick(feature) });
        L.marker(layer.getBounds().getCenter(), {
          icon: L.divIcon({
            className: 'map-label',
            html: feature.properties.region,
            iconSize: [100, 40]
          })
        }).addTo(mapRef);
      }
    });
    if (geoJsonLayer !== null && mapRef !== null) {
      geoJsonLayer.addTo(mapRef);
    }

    handleRefChange(mapRef as Map, id);
  }
  
  $effect(() => {
    if (mapRef && selectedRegion) {
      mapRef.fitBounds(selectedRegion.bounds as unknown as LatLngBounds);
    }
  })

  $effect(() => {
    if (geoJsonLayer && selectedRegion) {
      geoJsonLayer.eachLayer((layer: any) => {
        layer.setStyle({ fill: layer.feature.properties.region !== selectedRegion.name });
      });
    }
  })

  $effect(() => {
    if (src && mapRef !== null) {
      const newImageUrl = `${base}/assets/maps/${src.src}`;
      if (newImageUrl !== imageUrl) {
        const imageBounds = [[24,-125],[50,-65]];
        imageUrl = newImageUrl;
        
        if (imageOverlay !== null) {
          imageOverlay.remove();
        }
        
        imageOverlay = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.6 });
        if (imageOverlay !== null && mapRef !== null) {
          imageOverlay.addTo(mapRef);
        }
      }
    }
  })
</script>

{#if L}
  <div class='h-96 w-96 flex flex-col justify-center gap-1'>
    <div class='w-full h-5/6' use:initMap></div>
    <img class='h-auto w-full mx-auto' src={`${base}/assets/colorbars/${src.cbar}`} alt='Colorbar for leaflet map' />
  </div>
{/if}