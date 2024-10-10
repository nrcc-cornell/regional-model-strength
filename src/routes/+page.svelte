<script lang="ts">
  import {
    RegionalMap,
    SeasonSelector,
    RingLoader,
    ModelTable
  } from "$lib/components";
  import { seasons } from "$lib/constants";
  import { addToast } from "$lib/stores/toast.store";
  import type { Regions, Seasons, RegionSeasonData, CellData } from "../app";

  let selectedRegion: Regions|null = $state(null);
  let selectedSeason: Seasons = $state(seasons[0]);
  let selectedCell: CellData|null = $state(null);
  
  let data: RegionSeasonData|null = $state(null);
  let dataIsLoading = $state(false);
  
  function handleCellClick(clickedCell: CellData) {
    selectedCell = clickedCell;
  }

  async function fetchRegionSeasonData() {
    if (selectedRegion && selectedSeason) {
      dataIsLoading = true;
      
      // Minimum of 500ms loading time to avoid flashing loading component
      const [response, _] = await Promise.all([
        fetch('/api', {
          method: 'POST',
          body: JSON.stringify({ region: selectedRegion, season: selectedSeason }),
          headers: { 'content-type': 'application/json' }
        }),
        new Promise((resolve) =>
          setTimeout(resolve, 500),
        )
      ]);

      if (response.ok) {
        data = await response.json() as RegionSeasonData;
      } else {
        data = null;
        console.error(await response.text());
        addToast({
          message: "Unable to retrieve data. Please try a different region and/or season.",
          type: "error",
          dismissible: true,
          timeout: 0
        });
      }

      dataIsLoading = false;
    }
  }

  $effect(() => { fetchRegionSeasonData(); });
</script>

<div class="w-full max-w-[1500px] mx-auto flex flex-wrap justify-around box-border p-4">
  <RegionalMap bind:selectedFeature={selectedRegion} />
  
  <div class='flex justify-center items-center w-[720px]'>
    <div class='flex flex-col gap-3 p-8 justify-center items-center border border-slate-200 bg-white rounded-md'>
      <div class={data ? '': 'hidden'}>
        <SeasonSelector bind:selected={selectedSeason} />
      </div>
      
      {#if dataIsLoading}
      <RingLoader size='60' color='#ff3e00' unit='px' duration='2s' />
      {:else if data}
        <ModelTable {handleCellClick} tableData={data} />
      {:else}
        <div>
          <p>Select a region</p>
        </div>
      {/if}
    </div>
  </div>

  {#if selectedCell}
    <pre>
      {JSON.stringify(selectedCell, null, 4)}
    </pre>
  {/if}
</div>
