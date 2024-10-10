<script module>
  export type ModelSelectionsState = Record<RowNames, Record<Products, Models>> & Record<"global", Record<Products, Models|"">>;
  type ModelSelectionsStateKeys = keyof ModelSelectionsState;
</script>
<script lang="ts">
  import type { Products, Models, RowNames } from "../../../app";
  import { products } from "$lib/constants";

  type ModelSelectionsProps = {
    rowName: RowNames|"global";
    modelSelections: ModelSelectionsState;
  }

  let { rowName, modelSelections}: ModelSelectionsProps = $props();

  function handleModelChange(productName: Products, modelName: Models) {
    if (rowName === "global") {
      (Object.keys(modelSelections) as ModelSelectionsStateKeys[]).forEach(rowName => {
        modelSelections[rowName][productName] = modelName;
      });
    } else if (rowName) {
      modelSelections["global"][productName] = '';
      modelSelections[rowName][productName] = modelName;
    }
  }
</script>

<div class='flex flex-col gap-px'>
  {#each Object.entries(products) as [productName, modelNames], idx}
    {#if idx !== 0}
      <div class='my-px h-px w-full' style='background-color:#0e7490;'></div>
    {/if}
      
    <label class='font-normal flex justify-between h-7 mx-1'>
      <span class='mr-1'>{productName}:</span>
      <select style='width:155px;' class='bg-white border-b border-slate-300 pl-1' bind:value={modelSelections[rowName][productName as Products]} onchange={(evt) => handleModelChange(productName as Products, (evt.target as HTMLInputElement).value as unknown as Models)}>
        {#each modelNames as modelName}
          <option value={modelName}>{modelName}</option>
        {/each}
      </select>
    </label>
  {/each}
</div>