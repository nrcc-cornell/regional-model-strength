<script lang="ts">
	import { LayerCake, Svg, Html } from 'layercake';
	import { feature } from 'topojson-client';
	import { geoIdentity } from 'd3-geo';
	import { scaleOrdinal } from 'd3-scale';
	import { format } from 'd3-format';

	import MapSvg from './Map.svg.svelte';
	import Tooltip from './Tooltip.svelte';

	// Pre-projected topojson data, very small file
	import topoJsonData from './states-albers-10m';

	type Accumulator = {colors: string[], regions: string[]};

	// Data definitions
	const statesGeoJson = feature(topoJsonData, topoJsonData.objects.states);
	const regionPolysGeoJson = feature(topoJsonData, topoJsonData.objects.regions);
	const regionLinesGeoJson = feature(topoJsonData, topoJsonData.objects['region-lines']);
	const projection = geoIdentity;

	// Map state
	let evt: CustomEvent<any>|undefined;
	let hideTooltip = true;

	// Flat array of data that is mandatory for layercake
	let flatData: any[] = [];
	if ('features' in statesGeoJson) {
		flatData = statesGeoJson.features.map(d => d.properties);
	}

	// Color and region names that will be used to color the state polygons
	let colors: string[] = [];
	let regions: string[] = [];
	if ('features' in regionPolysGeoJson) {
		({ colors, regions } = regionPolysGeoJson.features.reduce((acc,f) => {
			if (f.properties !== null) {
				acc.regions.push(f.properties.region);
				acc.colors.push(f.properties.color);
			}
			return acc;
		},{ colors: [], regions: [] } as Accumulator));
	}

	const addCommas = format(',');
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
				features={'features' in regionLinesGeoJson ? regionLinesGeoJson.features : null}
				strokeWidth={2}
				fill='none'
			/>
		</Svg>
		
		<!-- Mouse interaction layer, region polygons -->
		<Svg>
			<MapSvg
				{projection}
				features={'features' in regionPolysGeoJson ? regionPolysGeoJson.features : null}
				fill='#00000000'
				on:mousemove={event => {
					evt = event;
					hideTooltip = !Boolean(event);
				}}
				on:mouseout={() => hideTooltip = true}
			/>
		</Svg>

		<!-- Tooltip -->
		<Html
			pointerEvents={false}
		>
			{#if hideTooltip !== true}
				<Tooltip
					{evt}
					let:detail
				>
					{#each Object.entries(detail.props) as [key, value]}
						{@const keyCapitalized = key.replace(/^\w/, d => d.toUpperCase())}
						<div class="row"><span>{keyCapitalized}:</span> {typeof value === 'number' ? addCommas(value) : value}</div>
					{/each}
				</Tooltip>
			{/if}
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