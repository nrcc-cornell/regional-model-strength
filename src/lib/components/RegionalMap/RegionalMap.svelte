<!-- Adapted from Layer Cake map example  https://layercake.graphics/example/MapLayered -->

<script lang="ts">
	import { LayerCake, Svg, Html } from 'layercake';
	import { feature } from 'topojson-client';
	import { geoIdentity } from 'd3-geo';
	import { scaleOrdinal } from 'd3-scale';

	import MapSvg from './Map.svg.svelte';
	import MapLabels from './MapLabels.html.svelte';

	// Pre-projected topojson data, very small file
	import topoJsonData from '$lib/topojson/statesAndRegionsTopojson';

	type RegionalMapProps = {
		selectedFeature: any;
		regions: Regions;
	}
	type Label = { center: number[], region: string };

	// Map state and props declarations
	let { selectedFeature = $bindable(), regions }: RegionalMapProps = $props();
	let evt: CustomEvent<any>|undefined = $state(undefined);

	// Data definitions
	const statesGeoJson = feature(topoJsonData, topoJsonData.objects.states);
	const regionPolysGeoJson = feature(topoJsonData, topoJsonData.objects.regions);
	const regionLinesGeoJson = feature(topoJsonData, topoJsonData.objects['region-lines']);
	const nationGeoJson = feature(topoJsonData, topoJsonData.objects.nation);
	const projection = geoIdentity;

	// Flat array of data that is mandatory for layercake
	let flatData: any[] = $state([]);
	if ('features' in statesGeoJson) {
		flatData = statesGeoJson.features.map(d => d.properties);
	}
	
	// Color and region names that will be used to color the state polygons
	const { regionIds, colors, labels } = regions.reduce((acc,{ name, dataKey, center, color }) => {
		acc.regionIds.push(dataKey);
		acc.colors.push(color);
		acc.labels.push({ center: center as unknown as number[], region: name });
		return acc;
	}, { regionIds: [] as string[], colors: [] as string[], labels: [] as Label[] });

	function handleRegionChange(f: any) {
		const regionObj = regions.find(r => r.name === f.properties.region);
		if (regionObj) {
			selectedFeature = regionObj;
		}
	}
</script>

<div class="map-container">
	<LayerCake
		data={statesGeoJson}
		z='region'
		zScale={scaleOrdinal(regionIds, colors)}
		zDomain={regionIds}
		zRange={colors}
		{flatData}
	>
		<!-- Layer for shadow, nation polygon -->
		<Svg>
			<MapSvg
				{projection}
				features={'features' in nationGeoJson ? nationGeoJson.features : undefined}
				fill='#00000000'
				shadow={true}
			/>
		</Svg>	
	
		<!-- Colored layered, state polygons -->
		<Svg>
			<MapSvg {projection} />
		</Svg>
		
		<!-- Regions' innerlines -->
		<Svg>
			<MapSvg
				{projection}
				features={'features' in regionLinesGeoJson ? regionLinesGeoJson.features : undefined}
				strokeWidth={2}
				fill='none'
			/>
		</Svg>

		<!-- Mouse interaction layer, region polygons -->
		<Svg>
			<MapSvg
				{projection}
				features={'features' in regionPolysGeoJson ? regionPolysGeoJson.features : undefined}
				selectedFeature={selectedFeature ? selectedFeature.name : selectedFeature}
				handleSelect={handleRegionChange}
				fill='#00000000'
				on:mousemove={event => {
					evt = event;
				}}
			/>
		</Svg>

		<!-- Region Labels -->
		<Html pointerEvents={false}>
      <MapLabels
        {projection}
        features={labels}
        getCoordinates={(d: Label) => d.center}
        getLabel={(d: Label) => d.region}
      />
    </Html>
	</LayerCake>
</div>

<style>
	.map-container {
		width: 600px;
		min-width: 600px;
		height: 400px;
	}
</style>