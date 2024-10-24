<!-- Rows/Columns hideable, show/hide btn that drops down to checkboxes -->
<!-- Cells clickable, bindable event, dont do stuff here -->
<!-- Model dropdown -->
<!-- Cell Icons dependent on thresholds -->

<script lang="ts">
  import { products, rowNames, colNames } from "$lib/constants";
  import Hider from "./Hider.svelte";
  import type { Hideables } from "./Hider.svelte";
  import ModelSelectors from "./ModelSelectors.svelte";
  import type { ModelSelectionsState } from "./ModelSelectors.svelte";
  import TableIcon from "./TableIcon.svelte";
  import TableLegend from "./TableLegend.svelte";

  type ModelTableProps = {
    tableData: RegionSeasonData;
    selectedCell: SelectedCellData|null;
    updateCellData: (x: SelectedCellData|CellData|null) => void;
    modelSelections: ModelSelectionsState;
    handleModelChange: (a: Products, b: Models, c: RowNames|"global") => void;
  }
  
  const productNames = Object.keys(products) as Products[];

  let {
    tableData,
    selectedCell,
    updateCellData,
    modelSelections,
    handleModelChange
  }: ModelTableProps = $props();

  let cols: Hideables<ColNames> = $state(colNames.map(c => ({ name: c, show: true })));
  let rows: Hideables<RowNames> = $state(rowNames.map(r => ({ name: r, show: true })));
  
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
        <th class='row-name-cell'>All Rows</th>
        <th class='selector-cell'><ModelSelectors {handleModelChange} rowName="global" {modelSelections} /></th>
        {#each cols as col}
          {#if col.show}
            <th class='data-column-name'>{col.name}</th>
          {/if}
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        {#if row.show}
          {#each productNames as productName, idx}
            <tr class="table-row">
              {#if idx === 0}
                <th class='row-name-cell' rowspan='{productNames.length}'>{row.name}</th>
                <td class='selector-cell' rowspan='{productNames.length}'><ModelSelectors {handleModelChange} rowName={row.name} {modelSelections} /></td>
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
                      <TableIcon value={tableData[productName][modelSelections[row.name][productName]][row.name][col.name].strengthValue} />
                    </div>
                  </td>
                {/if}
              {/each}
            </tr>
          {/each}
        {/if}
      {/each}
    </tbody>
  </table>

  <div class='w-full gap-2 grid grid-cols-table-footer mt-2'>
    <TableLegend icons={legendIcons} />

    <div class='flex justify-center gap-2'>
      <Hider btnText='Show/Hide Rows' bind:items={rows} />
      <Hider btnText='Show/Hide Cols' bind:items={cols} />
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

  .selector-cell {
    border-right: var(--thickLine);
  }

  .selector-cell {
    padding-right: 0;
  }
</style>