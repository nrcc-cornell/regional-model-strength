<script module>
  export type ModelSelectionsState = Record<RowNames, Record<Products, Models>> & Record<"global", Record<Products, Models|"">>;
  export type ModelSelectionsStateKeys = keyof ModelSelectionsState;
</script>
<script lang="ts">
  import { products } from "$lib/constants";

  type ModelSelectionsProps = {
    rowName: RowNames|"global";
    modelSelections: ModelSelectionsState;
    handleModelChange: (a: Products, b: Models, c: RowNames|"global") => void
  }

  let { rowName, modelSelections, handleModelChange }: ModelSelectionsProps = $props();
</script>

<div class='flex flex-col gap-px'>
  {#each Object.entries(products) as [productName, modelNames], idx}
    {#if idx !== 0}
      <div class='my-px h-px w-full' style='background-color:#0e7490;'></div>
    {/if}
      
    <label class='font-normal flex justify-between h-7 mx-1'>
      <span class='mr-1'>{productName}:</span>
      <select style='width:155px;' class='bg-white border-b border-slate-300 pl-1' bind:value={modelSelections[rowName][productName as Products]} onchange={(evt) => handleModelChange(productName as Products, (evt.target as HTMLInputElement).value as unknown as Models, rowName)}>
        {#each modelNames as modelName}
          <option value={modelName}>{modelName}</option>
        {/each}
      </select>
    </label>
  {/each}
</div>