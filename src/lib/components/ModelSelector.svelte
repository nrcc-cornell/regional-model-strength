<script lang="ts">
  type ModelSelectionsProps = {
    disabled: Boolean;
    product: ProductObjs;
    selectedModel: ModelIds;
    modelOptions: Models;
    handleModelChange: (a: ProductObjs, b: ModelIds) => void;
  }

  let { disabled, product, selectedModel, modelOptions, handleModelChange }: ModelSelectionsProps = $props();
</script>

<div class={`flex flex-col gap-px p-1 border rounded ${disabled ? 'pointer-events-none text-gray-500': ''}`}>
  <label class='font-normal flex justify-between h-7 mx-1'>
    <span class='mr-1'>{product.name}:</span>
    <select
      style='width:155px;'
      class={`bg-white border-b border-slate-300 pl-1 ${disabled ? '': 'hover:cursor-pointer'}`}
      bind:value={selectedModel}
      onchange={(evt) => handleModelChange(product, (evt.target as HTMLInputElement).value as ModelIds)}
    >
      {#each modelOptions as modelObj}
        <option value={modelObj.dataKey}>{modelObj.name}</option>
      {/each}
    </select>
  </label>
</div>