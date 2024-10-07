<!-- Adapted from Layer Cake map example  https://layercake.graphics/example/MapLayered -->

<script lang="ts">
	import { LayerCake, Svg, Html } from 'layercake';
	import { feature } from 'topojson-client';
	import { geoIdentity } from 'd3-geo';
	import { scaleOrdinal } from 'd3-scale';

	import MapSvg from './Map.svg.svelte';
	import MapLabels from './MapLabels.html.svelte';

	// Pre-projected topojson data, very small file
	import topoJsonData from './statesAndRegionsTopojson';

	type RegionalMapProps = { selectedFeature: any }
	type Label = { center: number[], region: string };

	// Data definitions
	const statesGeoJson = feature(topoJsonData, topoJsonData.objects.states);
	const regionPolysGeoJson = feature(topoJsonData, topoJsonData.objects.regions);
	const regionLinesGeoJson = feature(topoJsonData, topoJsonData.objects['region-lines']);
	const projection = geoIdentity;

	// Flat array of data that is mandatory for layercake
	let flatData: any[] = $state([]);
	if ('features' in statesGeoJson) {
		flatData = statesGeoJson.features.map(d => d.properties);
	}
	
	// Color and region names that will be used to color the state polygons
	let colors: string[] = $state([]);
	let regions: string[] = $state([]);
	let labels: Label[] = $state([]);
	if ('features' in regionPolysGeoJson) {
		regionPolysGeoJson.features.forEach(f => {
			if (f.properties !== null) {
				regions.push(f.properties.region);
				colors.push(f.properties.color);
				labels.push({ center: f.properties.center, region: f.properties.region });
			}
		});
	}
	
	// Map state and props declarations
	let { selectedFeature = $bindable() }: RegionalMapProps = $props();
	let evt: CustomEvent<any>|undefined = $state(undefined);
</script>

<div class="chart-container">
	<LayerCake
		data={statesGeoJson}
		z='region'
		zScale={scaleOrdinal(regions, colors)}
		zDomain={regions}
		zRange={colors}
		{flatData}
	>
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
				bind:selectedFeature
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
	.chart-container {
		width: 100%;
		height: 100%;
    min-height: 250px;
	}
</style>