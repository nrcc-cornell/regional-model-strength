<script lang="ts">
  import { RingLoader } from "$lib/components";
  import Hider from "./Hider.svelte";
  import type { Hideables } from "./Hider.svelte";
  import TableIcon from "./TableIcon.svelte";
  import TableLegend from "./TableLegend.svelte";

  type ModelTableProps = {
    tableData: SeasonData|null;
    selectedCell: SelectedCellData|null;
    handleCellSelection: (x: SelectedCellData|null) => void;
    selectedModels: SelectedModels;
    dataIsLoading: boolean;
    cols: ColArr;
    rows: RowArr;
    products: ProductArr;
    tableThresholds: TableThresholdsObj;
  }
  
  let {
    tableData,
    selectedCell,
    handleCellSelection,
    selectedModels,
    dataIsLoading,
    cols,
    rows,
    products,
    tableThresholds
  }: ModelTableProps = $props();
  
  let colObjs: Hideables<ColObjs> = $state(cols.map(c => ({ ...c, show: true })));
  let rowObjs: Hideables<RowObjs> = $state(rows.map(r => ({ ...r, show: true })));
  
  $effect(() => {
    rowObjs = rows.map(r => ({ ...r, show: true }));
  })
  
  $effect(() => {
    if (selectedCell) {
      const isRowVisible = Boolean(rowObjs.find(r => r.dataKey === selectedCell.row.dataKey && r.show));
      const isColVisible = Boolean(colObjs.find(c => c.dataKey === selectedCell.col.dataKey && c.show));
      
      if (!isRowVisible || !isColVisible) {
        handleCellSelection(null);
      }
    }
  })
  
  const legendIcons = [
    { text: 'Poor', value: 0 },
    { text: 'Good', value: 5 },
    { text: 'Excellent', value: 10 }
  ];
</script>

<div class='flex flex-col items-center gap-2'>
  <table>
    <thead>
      <tr>
        <th class='row-name-cell' colSpan=2></th>
        {#each colObjs as col}
          {#if col.show}
            <th class='data-column-name'>{col.name}</th>
          {/if}
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if dataIsLoading || tableData === null}
        {#each rowObjs as row, rowIdx}
          {#if row.show}
            {#each products as productName, pidx}   <!-- This loop is necessary to create a second row in which to span -->
              <tr class="table-row h-fit">
                {#if pidx === 0}
                  <th rowspan='{products.length}'>{row.name}</th>
                  <td rowspan='{products.length}' class='row-name-cell'>
                    <div class='flex flex-col gap-[10px]'>
                      {#each products as productObj, idx}
                        {#if idx !== 0}
                          <div class='divider'></div>
                        {/if}
                        <span class='mr-1'>{productObj.name}:</span>
                      {/each}
                    </div>
                  </td>
                {/if}

                {#if rowIdx === 0 && pidx === 0}
                  <td colSpan={colObjs.filter(c => c.show).length} rowSpan={rowObjs.filter(r => r.show).length * products.length}>
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
        {#each rowObjs as row}
          {#if row.show}
            {#each products as productObj, idx}
              <tr class="table-row">
                {#if idx === 0}
                  <th rowspan='{products.length}'>{row.name}</th>
                  <td rowspan='{products.length}' class='row-name-cell'>
                    <div class='flex flex-col gap-[10px]'>
                      {#each products as productObj,idx}
                        {#if idx !== 0}
                          <div class='divider'></div>
                        {/if}
                        <span class='mr-1'>{productObj.name}:</span>
                      {/each}
                    </div>
                  </td>
                {/if}
                {#each colObjs as col}
                  {#if col.show}
                    <td
                      class={'data-cell ' + ((selectedCell && selectedCell.product.dataKey === productObj.dataKey && selectedCell.row.dataKey === row.dataKey && selectedCell.col.dataKey === col.dataKey) ? 'bg-zinc-300' : 'hover:bg-zinc-200 hover:cursor-pointer')}
                      onclick={() => 
                        handleCellSelection({product: productObj, row, col})
                      }
                    >
                      <div class='w-full h-full flex justify-center items-center'>
                        {console.log(tableData, selectedModels, productObj, row, col)}
                        <TableIcon value={tableData[productObj.dataKey][selectedModels[productObj.dataKey]][row.dataKey][col.dataKey]} {tableThresholds} />
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
      <Hider btnText='Show/Hide Rows' bind:items={rowObjs} deactivated={tableData === null} />
      <Hider btnText='Show/Hide Cols' bind:items={colObjs} deactivated={tableData === null} />
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

  .divider {
    border-top: var(--thinLine);
  }
</style>