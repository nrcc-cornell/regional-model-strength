<script lang="ts">
  import { RingLoader } from "$lib/components";
  import Hider from "./Hider.svelte";
  import type { Hideables } from "./Hider.svelte";
  import ModelSelectors from "./ModelSelectors.svelte";
  import type { ModelSelectionsState } from "./ModelSelectors.svelte";
  import TableIcon from "./TableIcon.svelte";
  import TableLegend from "./TableLegend.svelte";

  type ModelTableProps = {
    tableData: RegionSeasonData|null;
    selectedCell: SelectedCellData|null;
    updateCellData: (x: SelectedCellData|CellData|null) => void;
    modelSelections: ModelSelectionsState;
    handleModelChange: (a: Products, b: Models, c: RowNames|"global") => void;
    dataIsLoading: boolean;
    colNames: ColNames[];
    rowNames: RowNames[];
    products: ProductsObj;
    tableThresholds: TableThresholdsObj;
  }
  
  let {
    tableData,
    selectedCell,
    updateCellData,
    modelSelections,
    handleModelChange,
    dataIsLoading,
    colNames,
    rowNames,
    products,
    tableThresholds
  }: ModelTableProps = $props();
  
  const productNames = Object.keys(products) as Products[];
  
  let cols: Hideables<ColNames> = $state(colNames.map(c => ({ name: c, show: true })));
  let rows: Hideables<RowNames> = $state(rowNames.map(r => ({ name: r, show: true })));
  $effect(() => {
    rows = rowNames.map(r => ({ name: r, show: true }));
  })
  
  const legendIcons = [
    { text: 'Poor', value: 0 },
    { text: 'Good', value: 5 },
    { text: 'Excellent', value: 10 }
  ];

  $effect(() => {
    if (selectedCell) {
      const idParts = selectedCell.id.split('-');
      const isRowVisible = Boolean(rows.find(r => r.name === idParts[1] && r.show));
      const isColVisible = Boolean(cols.find(c => c.name === idParts[2] && c.show));
      
      if (!isRowVisible || !isColVisible) {
        updateCellData(null);
      }
    }
  })
</script>

<div class='flex flex-col items-center gap-2'>
  <table>
    <thead>
      <tr>
        <th class='row-name-cell'></th>
        <!-- <th colSpan=2 class='selector-cell'></th> -->
        <!-- <th class='row-name-cell'>All Rows</th>
        <th class='selector-cell'><ModelSelectors {handleModelChange} rowName="global" {modelSelections} /></th> -->
        {#each cols as col}
          {#if col.show}
            <th class='data-column-name'>{col.name}</th>
          {/if}
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if dataIsLoading || tableData === null}
        {#each rows as row, rowIdx}
          {#if row.show}
            {#each productNames as productName, idx}
              <tr class="table-row">
                {#if idx === 0}
                  <th class='row-name-cell' rowspan='{productNames.length}'>{row.name}</th>
                  <!-- <td class='selector-cell' rowspan='{productNames.length}'><ModelSelectors {handleModelChange} rowName={row.name} {modelSelections} /></td> -->
                {/if}

                {#if rowIdx === 0 && idx === 0}
                  <td colSpan={cols.filter(c => c.show).length} rowSpan={rows.filter(r => r.show).length * productNames.length}>
                    {#if dataIsLoading}
                      <div class='flex justify-center items-center'>
                        <RingLoader size='60' color='#ff3e00' unit='px' duration='2s' />
                      </div>
                    {:else}
                      <div class='text-center'>Select a region</div>
                    {/if}
                  </td>
                {/if}
              </tr>
            {/each}
          {/if}
        {/each}  
      {:else}
        {#each rows as row}
          {#if row.show}
            {#each productNames as productName, idx}
              <tr class="table-row">
                {#if idx === 0}
                  <th class='row-name-cell' rowspan='{productNames.length}'>{row.name}</th>
                  <!-- <td class='selector-cell' rowspan='{productNames.length}'><ModelSelectors {handleModelChange} rowName={row.name} {modelSelections} {products} /></td> -->
                {/if}
                {#each cols as col}
                  {#if col.show}
                    <td
                      class={'data-cell' + (selectedCell && selectedCell.id === `${productName}-${row.name}-${col.name}` ? ' bg-zinc-300' : ' hover:bg-zinc-200 hover:cursor-pointer')}
                      onclick={() => 
                        updateCellData({
                          ...tableData[productName][modelSelections[row.name][productName]][row.name][col.name],
                          "id": `${productName}-${row.name}-${col.name}`
                        })
                      }
                    >
                      <div class='w-full h-full flex justify-center items-center'>
                        <TableIcon value={tableData[productName][modelSelections[row.name][productName]][row.name][col.name].strengthValue} {tableThresholds} />
                      </div>
                    </td>
                  {/if}
                {/each}
              </tr>
            {/each}
          {/if}
        {/each}
      {/if}
    </tbody>
  </table>

  <div class='w-full gap-2 grid grid-cols-table-footer mt-2'>
    <TableLegend icons={legendIcons} {tableThresholds} />

    <div class='flex justify-center gap-2'>
      <Hider btnText='Show/Hide Rows' bind:items={rows} deactivated={tableData === null} />
      <Hider btnText='Show/Hide Cols' bind:items={cols} deactivated={tableData === null} />
    </div>

    <a href='https://www.rcc-acis.org/' target="_blank" aria-label="RCC ACIS Logo Link"><img src='/logos/acis.jpg' alt="RCC ACIS logo"/></a>
  </div>
</div>

<style>
  :root{
    --thinLine: 1px solid #0e7490;
    --thickLine: 3px solid #164e63;
  }

  th {
    width: 100px;
    height: 90px;
  }

  td, th {
    padding: 4px;
    box-sizing: border-box;
  }

  table {
    border: var(--thickLine);
    border-left: none;
    border-top: none;
  }

  .data-cell,
  .data-column-name {
    border: var(--thinLine);
  }

  .data-column-name {
    border-top: none;
  }

  .table-row:nth-child(odd) {
    border-top: var(--thickLine);
  }

  .row-name-cell {
    border-right: var(--thickLine);
    padding-right: 0;
  }
</style>