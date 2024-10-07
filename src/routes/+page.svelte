<script lang="ts">
  import {
    RegionalMap,
    SeasonSelector
  } from "$lib";

  let selectedRegion: string|null = $state(null);
  let selectedSeason: string|null = $state(null);
  const regions = ['Northeast', 'Northwest', 'Southwest'];
</script>

<div class="w-full">
  <div>
    <p>{selectedRegion || 'No Region Selected'}</p>
    <p>{selectedSeason || 'No Season Selected'}</p>
  </div>

  <div class='flex flex-col items-center'>
    
    <div>
      {#each regions as region}
        <button class='bg-black text-white p-3 m-6 hover:bg-slate-700' onclick={() => selectedRegion = region}>{region}</button>
      {/each}
      <button class='bg-black text-white p-3 m-6 hover:bg-slate-700' onclick={() => selectedRegion = null}>Clear</button>
    </div>
  </div>
  <!-- <RegionalMap bind:selectedFeature={selectedRegion} /> -->
  
  <SeasonSelector bind:selected={selectedSeason} />

  <!-- <div>
    <p>Chart</p>
  </div> -->
</div>
