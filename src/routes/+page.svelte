<script lang="ts">
  import {
    RegionalMap,
    SliderSelector,
    ModelTable,
    LinkedInteractiveModelMaps,
    ChartPng,
    ModelSelector
  } from "$lib/components";
  import { regions, seasons, dataTypes, rows, cols, products, tableThresholds, models } from "$lib/constants";
  import { addToast } from "$lib/stores/toast.store";
  
  let selectedRegion: RegionObjs|null = $state(null);
  let selectedSeason: SeasonObjs = $state(seasons[0]);
  let selectedDataType: DataTypeObjs = $state(dataTypes[1]);
  let selectedModels: SelectedModels = $state({ 'loca': 'ens', 'star': 'ens' });
  let selectedCell: SelectedCellData|null = $state(null);
  let mapSrcs: MapSrc[]|null = $state(null);

  let data: RegionData|null = $state(null);
  let dataIsLoading = $state(false);

  async function fetchRegionSeasonData() {
    if (selectedRegion) {
      // Display loading component
      dataIsLoading = true;
      
      // Minimum of 500ms loading time to avoid flashing loading component
      const [response, _] = await Promise.all([
        fetch('/api', {
          method: 'POST',
          body: JSON.stringify({ region: selectedRegion.dataKey }),
          headers: { 'content-type': 'application/json' }
        }),
        new Promise((resolve) =>
          setTimeout(resolve, 500),
        )
      ]);

      if (response.ok) {
        // Update data on successful call
        data = await response.json() as RegionData;
      } else {
        // Handle displaying error on failed call
        data = null;
        console.error(await response.text());
        addToast({
          message: "Unable to retrieve data. Please try a different region and/or season.",
          type: "error",
          dismissible: true,
          timeout: 0
        });
      }

      // Remove loading component
      dataIsLoading = false;
    }
  }

  $effect(() => { fetchRegionSeasonData(); });

  function constructMapSrcs(newSelectedCell: SelectedCellData, selectedModels: SelectedModels) {
    const row = newSelectedCell.row.dataKey;
    const col = newSelectedCell.col.dataKey;
    const product = newSelectedCell.product.dataKey;
    const model = selectedModels[product];
    
    const observed = product === 'loca' ? 'livneh' : 'nclimgrid';

    return [
      { src: `${observed}_${row}_${col}_blank.png`, cbar: `${row}_map_colorbar.png` },
      { src: `${product}_${model}_${row}_${col}_blank.png`, cbar: `${row}_map_colorbar.png` },
      { src: `${observed}_${product}_${row}_${col === 'historical_mean' ? 'historical_bias' : col}_blank.png`, cbar: 'bias_map_colorbar.png' },
    ];
  }

  function updateSelectedCell(selection: SelectedCellData|null) {
    if (selection) {
      selectedCell = selection;
      mapSrcs = constructMapSrcs(selection, selectedModels);
    } else {
      selectedCell = null;
      mapSrcs = null;
    }
  }

  function handleModelChange(selectedProductObj: ProductObjs, selectedModelId: ModelIds) {
    selectedModels = { ...selectedModels, [selectedProductObj.dataKey]: selectedModelId };
  }
</script>

<div class="w-full max-w-[1500px] mx-auto flex flex-wrap justify-around items-center box-border p-4">
  <RegionalMap bind:selectedFeature={selectedRegion} {regions} />

  <div class='flex justify-center items-center w-[720px]'>
    <div class='flex flex-col gap-3 p-8 justify-center items-center border border-slate-200 bg-white rounded-md'>
      <div>
        <SliderSelector disabled={true} bind:selected={selectedSeason} options={seasons as unknown as NamesObj[]} label='Seasons' />
        <SliderSelector disabled={true} bind:selected={selectedDataType} options={dataTypes as unknown as NamesObj[]} label='Data' spacing='large' />
      </div>

      <div>
        <div class='font-bold text-center'>Model</div>
        <div class='flex gap-2'>
          {#each products as productObj}
            <ModelSelector
              disabled={selectedRegion === null}
              product={productObj}
              selectedModel={selectedModels[productObj.dataKey]}
              modelOptions={models[productObj.dataKey]}
              {handleModelChange}
            />
          {/each}
        </div>
      </div>
      
      <ModelTable
        tableData={data ? data[selectedSeason.dataKey] : data}
        rows={rows[selectedDataType.dataKey]}
        {cols}
        {products}
        {dataIsLoading}
        {tableThresholds}
        {selectedCell}
        handleCellSelection={updateSelectedCell}
        {selectedModels}
      />
    </div>
  </div>

  {#if selectedCell && selectedRegion}
    <div class='p-4 h-fit w-fit'>
      <LinkedInteractiveModelMaps
        {regions}
        bind:selectedRegion
        mapSrcs={mapSrcs || []}
      />
    </div>

    <ChartPng {selectedRegion} {selectedCell} />
  {/if}
</div>