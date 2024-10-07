<script lang="ts">
  import {
    RegionalMap
  } from "$lib";

  let selectedRegion = $state(null);
</script>

<div class="w-full">
  <h1>New App</h1>
  <br/>
  <p>With some content.</p>
  <p>{selectedRegion}</p>
  <br/>
  <br/>
  <br/>
  <RegionalMap bind:selectedFeature={selectedRegion} />
</div>
