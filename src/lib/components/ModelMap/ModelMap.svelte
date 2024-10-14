<script lang="ts">
	import { base } from "$app/paths";

  type ModelMapProps = {
    src: string;
  }

  let { src }: ModelMapProps = $props();

  console.log(src);
</script>

<img src='{base}/assets/maps/fake_map.png' alt="Model strength map for selected cell" />