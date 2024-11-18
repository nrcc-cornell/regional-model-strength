<script lang="ts">
  import {
    RegionalMap,
    ModelTable,
    LinkedInteractiveModelMaps,
    ChartPng,
    SliderSelector
  } from "$lib/components";
  import { regions, seasons, rowNames, colNames, products, tableThresholds, mapsInfo } from "$lib/constants";
  import { addToast } from "$lib/stores/toast.store";
  import type { ModelSelectionsState, ModelSelectionsStateKeys } from "$lib/components/ModelTable/ModelSelectors.svelte";
	import ModelMap from "$lib/components/ModelMap/ModelMap.svelte";
	import ModelChart from "$lib/components/ModelChart/ModelChart.svelte";
	import type { LatLngBounds } from "leaflet";
  
  const productNames = Object.keys(products) as Products[];

  let selectedRegion: Regions|null = $state(null);
  let selectedSeason: Seasons = $state(seasons[0]);
  let selectedDataType: DataTypes = $state(Object.keys(rowNames)[0] as DataTypes);
  let selectedCell: SelectedCellData|null = $state(null);

  let modelSelections = $state(Object.values(rowNames).reduce((tableAcc: any, rows: any) => {
    if (!(productNames[0] in tableAcc)) {
      tableAcc['global'] = {};
      Object.entries(products).forEach(([productName, modelNames]) => tableAcc['global'][productName] = modelNames[0]);
    }

    rows.forEach((rowName: RowNames) => {
      tableAcc[rowName] = Object.entries(products).reduce((rowAcc: any, [productName, modelNames]) => {
        rowAcc[productName] = modelNames[0];
        return rowAcc;
      }, {});
    });

    return tableAcc;
  }, {}) as unknown as ModelSelectionsState);
  
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

  $inspect(selectedDataType);
</script>

<div class="w-full max-w-[1500px] mx-auto flex flex-wrap justify-around items-center box-border p-4">
  <RegionalMap bind:selectedFeature={selectedRegion} {regions} />
  
  <div class='flex justify-center items-center w-[720px]'>
    <div class='flex flex-col gap-3 p-8 justify-center items-center border border-slate-200 bg-white rounded-md'>
      <div>
        <SliderSelector bind:selected={selectedSeason} options={seasons as unknown as string[]} label='Seasons' />
        <SliderSelector bind:selected={selectedDataType} options={Object.keys(rowNames)} label='Data' spacing='large' />
      </div>
      
      <ModelTable
        tableData={data}
        colNames={colNames as unknown as ColNames[]}
        rowNames={rowNames[selectedDataType] as unknown as RowNames[]}
        {selectedCell}
        {updateCellData}
        {modelSelections}
        {handleModelChange}
        {dataIsLoading}
        {products}
        {tableThresholds}
      />
    </div>
  </div>

  {#if selectedCell}
      <!-- <ModelMap src={selectedCell.mapPngFileName} /> -->
      <div class='p-4 h-fit w-fit'>
        <LinkedInteractiveModelMaps
          regionBounds={(regions.find(r => r.name === selectedRegion) || { name: null, bounds: [[25,-125],[52,-65]] }).bounds as unknown as LatLngBounds}
          bind:selectedRegion
          {mapsInfo}
        />
      </div>
      <!-- <ModelChart data={selectedCell.graphData.data.map((v, i) => (selectedCell ? { x: 2024 - selectedCell.graphData.data.length + i, y: v} : { x: i, y: 0}))} /> -->
      <ChartPng {selectedRegion} />
  {/if}
</div>