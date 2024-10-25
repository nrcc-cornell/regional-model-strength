<script lang="ts">
  import {
    RegionalMap,
    SeasonSelector,
    ModelTable,
    InteractiveModelMap,
    ChartPng
  } from "$lib/components";
  import { regions, seasons, rowNames, products } from "$lib/constants";
  import { addToast } from "$lib/stores/toast.store";
  import type { ModelSelectionsState, ModelSelectionsStateKeys } from "$lib/components/ModelTable/ModelSelectors.svelte";
	import ModelMap from "$lib/components/ModelMap/ModelMap.svelte";
	import ModelChart from "$lib/components/ModelChart/ModelChart.svelte";
  
  const productNames = Object.keys(products) as Products[];

  let selectedRegion: Regions|null = $state('Northeast');
  // let selectedRegion: Regions|null = $state(null);
  let selectedSeason: Seasons = $state(seasons[0]);
  // let selectedCell: SelectedCellData|null = $state(null);
  let selectedCell: SelectedCellData|null = $state({
  "strengthValue": 2,
  "mapPngFileName": "Northeast_Winter_STAR_Weighted Mean_Mean Temperature_Historical Bias.png",
  "graphData": {
    "data": [
      0.11,
      1.37,
      9.07,
      4.65,
      7.94,
      7.65,
      0.87,
      9.06,
      7.21,
      9.28,
      3.37,
      2.41,
      1.71,
      0.52,
      0.22,
      9.5,
      9.53,
      1.81,
      0.68,
      6.26,
      8.08,
      7.38,
      8.23,
      0.35,
      9.76,
      2.58,
      9,
      0.28,
      1.16,
      2.22,
      7.39,
      5.49,
      2.37,
      4.05,
      0.79,
      8.09,
      9.25,
      2.21,
      3.26,
      9.74,
      0.21,
      1.77,
      0.31,
      3.21,
      1.61,
      5.56,
      3.94,
      9.79,
      6.06,
      3.97
    ]
  },
  "id": "STAR-Mean Temperature-Historical Bias"
});
  
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
  
  function updateCellData(newCellData: SelectedCellData|CellData|null) {
    if (newCellData === null) {
      selectedCell = null;
    } else if ("id" in newCellData) {
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

  function constructSrc(id: string) {
    const [ model, row, column ] = id.split('-');
    if (column !== 'Historical Bias') {
      return 'fake_map.png';
    } else {
      return `${model.toLowerCase()}_rx1dayMean_downscale_bias_map.png`;
    }
  }

  $effect(() => { fetchRegionSeasonData(); });
</script>

<div class="w-full max-w-[1500px] mx-auto flex flex-wrap justify-around items-center box-border p-4">
  <RegionalMap bind:selectedFeature={selectedRegion} />
  
  <div class='flex justify-center items-center w-[720px]'>
    <div class='flex flex-col gap-3 p-8 justify-center items-center border border-slate-200 bg-white rounded-md'>
      <div>
        <SeasonSelector bind:selected={selectedSeason} />
      </div>
      
      <ModelTable
        tableData={data}
        {selectedCell}
        {updateCellData}
        {modelSelections}
        {handleModelChange}
        {dataIsLoading}
      />
    </div>
  </div>

  {#if selectedCell}
    <div class='w-full grid grid-cols-map-chart items-center'>
        <!-- <ModelMap src={selectedCell.mapPngFileName} /> -->
        <div class='p-4' style='width:100%;height:600px'>
          <InteractiveModelMap
            src={constructSrc(selectedCell.id)}
            regionBounds={(regions.find(r => r.name === selectedRegion) || { name: null, bounds: [[25,-125],[52,-65]] }).bounds as [[number, number],[number, number]]}
            bind:selectedRegion
          />
        </div>
        <!-- <ModelChart data={selectedCell.graphData.data.map((v, i) => (selectedCell ? { x: 2024 - selectedCell.graphData.data.length + i, y: v} : { x: i, y: 0}))} /> -->
        <ChartPng {selectedRegion} />
    </div>
  {/if}
</div>