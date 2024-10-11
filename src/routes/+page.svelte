<script lang="ts">
  import {
    RegionalMap,
    SeasonSelector,
    RingLoader,
    ModelTable
  } from "$lib/components";
  import { seasons, rowNames, products } from "$lib/constants";
  import { addToast } from "$lib/stores/toast.store";
  import type { ModelSelectionsState, ModelSelectionsStateKeys } from "$lib/components/ModelTable/ModelSelectors.svelte";
  
  const productNames = Object.keys(products) as Products[];

  let selectedRegion: Regions|null = $state('Northeast');
  let selectedSeason: Seasons = $state(seasons[0]);
  let selectedCell: SelectedCellData|null = $state(null);
  let modelSelections = $state(rowNames.reduce((tableAcc: any, name: RowNames) => {
    if (!(productNames[0] in tableAcc)) {
      tableAcc['global'] = {};
      Object.entries(products).forEach(([productName, modelNames]) => tableAcc['global'][productName] = modelNames[0]);
    }
    
    tableAcc[name] = Object.entries(products).reduce((rowAcc: any, [productName, modelNames]) => {
      rowAcc[productName] = modelNames[0];
      return rowAcc;
    }, {});

    return tableAcc;
  }, {}) as ModelSelectionsState);
  
  let data: RegionSeasonData|null = $state(null);
  let dataIsLoading = $state(false);
  
  function updateCellData(newCellData: SelectedCellData|CellData) {
    if ("id" in newCellData) {
      selectedCell = newCellData;
    } else if (selectedCell) {
      selectedCell = { ...newCellData, "id": selectedCell.id };
    }
  }

  function handleModelChange(productName: Products, modelName: Models, rowName: RowNames|"global") {
    if (rowName === "global") {
      (Object.keys(modelSelections) as ModelSelectionsStateKeys[]).forEach(rowName => {
        modelSelections[rowName][productName] = modelName;
      });
    } else if (rowName) {
      modelSelections["global"][productName] = '';
      modelSelections[rowName][productName] = modelName;
    }

    if (data && selectedCell) {
      const idParts = selectedCell.id.split('-') as [Products, RowNames, ColNames];
      if (idParts[0] === productName && (rowName === 'global' || idParts[1] === rowName)) {
        updateCellData(data[productName][modelSelections[idParts[1]][productName]][idParts[1]][idParts[2]]);
      }
    }
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
        if (selectedCell) {
          const idParts = selectedCell.id.split('-') as [Products, RowNames, ColNames];
          updateCellData(data[idParts[0]][modelSelections[idParts[1]][idParts[0]]][idParts[1]][idParts[2]]);
        }
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
        <ModelTable
          tableData={data}
          {selectedCell}
          {updateCellData}
          {modelSelections}
          {handleModelChange}
        />
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
