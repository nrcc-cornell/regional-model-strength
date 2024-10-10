<!-- Rows/Columns hideable, show/hide btn that drops down to checkboxes -->
<!-- Cells clickable, bindable event, dont do stuff here -->
<!-- Model dropdown -->
<!-- Cell Icons dependent on thresholds -->

<script lang="ts">
  import type { RegionSeasonData, Products, ColNames, RowNames, CellData } from "../../../app";
  import { products, rowNames, colNames } from "$lib/constants";
  import Hider from "./Hider.svelte";
  import type { Hideables } from "./Hider.svelte";
  import ModelSelectors from "./ModelSelectors.svelte";
  import type { ModelSelectionsState } from "./ModelSelectors.svelte";
  import TableIcon from "./TableIcon.svelte";

  type ModelTableProps = {
    tableData: RegionSeasonData;
    handleCellClick: (x: CellData) => void
  }
  
  const productNames = Object.keys(products) as Products[];

  let { tableData, handleCellClick }: ModelTableProps = $props();

  let cols: Hideables<ColNames> = $state(colNames.map(c => ({ name: c, show: true })));
  let rows: Hideables<RowNames> = $state(rowNames.map(r => ({ name: r, show: true })));
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
</script>

<div class='flex flex-col items-center gap-2'>
  <table>
    <thead>
      <tr>
        <th class='row-name-cell'>All Rows</th>
        <th class='selector-cell'><ModelSelectors rowName="global" {modelSelections} /></th>
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
                <td class='selector-cell' rowspan='{productNames.length}'><ModelSelectors rowName={row.name} {modelSelections} /></td>
              {/if}
              {#each cols as col}
                {#if col.show}
                  <td class='data-cell'><TableIcon handleCellClick={() => handleCellClick(tableData[productName][modelSelections[row.name][productName]][row.name][col.name])} value={tableData[productName][modelSelections[row.name][productName]][row.name][col.name].strengthValue} /></td>
                {/if}
              {/each}
            </tr>
          {/each}
        {/if}
      {/each}
    </tbody>
  </table>

  <div class='flex gap-2'>
    <Hider btnText='Show/Hide Rows' bind:items={rows} />
    <Hider btnText='Show/Hide Cols' bind:items={cols} />
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