<!-- Code from svelte-loading-spinners, copied and adapted to avoid svelte closing tag warnings -->

<script lang="ts">
	export let color = '#FF3E00';
	export let unit = 'px';
	export let duration = '2s';
	export let size = '60';
	export let pause = false;
	const range = (size: number, startAt = 0) => [...Array(size).keys()].map((i) => i + startAt);
</script>

<div class="wrapper" style="--size: {size}{unit}; --color: {color}; --duration: {duration};">
	{#each range(2, 1) as version}
		<div class="border {version}" class:pause-animation={pause}></div>
	{/each}
</div>

<style>
	.wrapper {
		position: relative;
		width: var(--size);
		height: var(--size);
	}
	.border {
		border-color: var(--color);
		position: absolute;
		top: 0px;
		left: 0px;
		width: var(--size);
		height: var(--size);
		opacity: 0.4;
		perspective: 800px;
		border-width: 6px;
		border-style: solid;
		border-image: initial;
		border-radius: 100%;
	}
	.border.\31 {
		animation: var(--duration) linear 0s infinite normal none running ringOne;
	}
	.border.\32 {
		animation: var(--duration) linear 0s infinite normal none running ringTwo;
	}
	.pause-animation {
		animation-play-state: paused;
	}

	@keyframes ringOne {
		0% {
			transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
		}
		100% {
			transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg);
		}
	}
	@keyframes ringTwo {
		0% {
			transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
		}
		100% {
			transform: rotateX(180deg) rotateY(360deg) rotateZ(360deg);
		}
	}
</style>
