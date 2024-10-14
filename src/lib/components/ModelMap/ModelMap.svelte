<script lang="ts">
	import { base } from "$app/paths";

  type ModelMapProps = {
    src: string;
  }

  let { src }: ModelMapProps = $props();
</script>

<img src='{base}/assets/maps/{src}' alt="Model strength map for selected cell" />