<!-- Adapted from Layer Cake map example  https://layercake.graphics/example/MapLayered -->
 
 <script lang='ts'>
	import { getContext, createEventDispatcher } from 'svelte';
	import { geoPath } from 'd3-geo';
	import { raise } from 'layercake';

	interface MapProps {
		projection: Function;
		fixedAspectRatio?: number;
		fill?: string;
		stroke?: string;
		strokeWidth?: number;
		features?: Array<any>;
		selectedFeature?: any;
		shadow?: boolean
	}

	const dispatch = createEventDispatcher();
	const { data, width, height, zGet } = getContext('LayerCake') as {data: any, width: any, height: any, zGet: any};

	let { projection, fixedAspectRatio, fill, stroke = '#333', strokeWidth = 0.5, features, selectedFeature = $bindable(null), shadow=false }: MapProps = $props();

	let fitSizeRange = $derived(fixedAspectRatio ? [100, 100 / fixedAspectRatio] : [$width, $height]);

	let projectionFn = $derived(projection()
		.fitSize(fitSizeRange, $data));

	let geoPathFn = $derived(geoPath(projectionFn));

	function handleMousemove(feature: any) {
		return function handleMousemoveFn(e: any) {
			raise(this);
			if (e.layerX !== 0 && e.layerY !== 0) {
				dispatch('mousemove', { e, props: feature.properties });
			}
		}
	}

	function handleClick(e: MouseEvent, feature: any) {
		selectedFeature = feature.properties.region;
	}

	function handleKeyPress(e: KeyboardEvent, feature: any) {
		e.preventDefault();
		if (e.key === 'Enter') {
			selectedFeature = feature.properties.region;
		}
	}
</script>


<g
class="map-group"
onmouseout={(e) => dispatch('mouseout')}
onblur={(e) => dispatch('mouseout')}
role='button'
tabindex=0
>
<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="12" height="12">
	<path d="M-1,1 l2,-2
					M0,12 l12,-12
					M11,13 l2,-2" 
			style="stroke:rgb(255, 115, 0); stroke-width:2" />
</pattern>
	{#each (features || $data.features) as feature}
	<path
			class={(selectedFeature === feature.properties.region ? "selected-feature" : "feature-path") + (shadow ? ' shadow' : '')}
			fill={selectedFeature === feature.properties.region ? "url(#diagonalHatch)" : fill || $zGet(feature.properties)}
			stroke={stroke}
			stroke-width={strokeWidth}
			d="{geoPathFn(feature)}"
			onmouseover={(e) => dispatch('mousemove', { e, props: feature.properties })}
			onfocus={(e) => dispatch('mousemove', { e, props: feature.properties })}
			onmousemove={handleMousemove(feature)}
			onclick={(e) => handleClick(e, feature)}
			onkeydown={(e) => handleKeyPress(e, feature)}
      role='button'
      tabindex=0
		></path>
	{/each}
</g>

<style>
	.feature-path:hover {
		stroke: #000;
		stroke-width: 2px;
	}
	.selected-feature {
		stroke: rgb(255, 115, 0);
		stroke-width: 2px;
	}

	.shadow {
		-webkit-filter: drop-shadow(black 2px 2px 2px);
		filter: drop-shadow(black 2px 2px 2px);
	}
</style>
