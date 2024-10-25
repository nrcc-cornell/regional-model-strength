<script module>
  export type Hideables<Names> = {
    name: Names;
    show: boolean;
  }[]

  type HiderProps<HideableNames> = {
    btnText: string;
    items: Hideables<HideableNames>;
    deactivated: boolean;
  }

  type HideableNames = RowNames | ColNames;
</script>

<script lang="ts">

  let { deactivated, btnText, items=$bindable() }: HiderProps<HideableNames> = $props();
  let isOpen = $state(false);

  const toggleOpen = () => {
    isOpen = !isOpen
  }

  const handleFocusLoss = ({ relatedTarget, currentTarget }: any) => {
    if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return;
    isOpen = false
  }

  const handleToggleShow = (itemName: string) => {
    const newItems = [...items];
    const idx = newItems.findIndex(i => i.name === itemName);
    newItems[idx].show = !newItems[idx].show;
    items = newItems;
  }
</script>

<div class="hider" onfocusout={handleFocusLoss}>
  <button class={"hider-btn " + (deactivated ? "inactive" : "active")} onclick={deactivated ? () => {} : toggleOpen} >{btnText}</button>
  <ul class="hider-content menu shadow bg-base-100 rounded-box" class:show={isOpen}>
    {#each items as item}
      <li class='[&:not(:last-child)]:border-b'>
        <button onclick={() => handleToggleShow(item.name)} class='flex gap-2 items-center px-2 py-1 w-full'>
            <div class='h-4 w-4 {item.show ? "bg-black" : "bg-white"} border-2 border-black rounded-sm'>
              {#if item.show}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90">
                  <path fill="none" stroke="white" stroke-width="20" d="M 5 55 L 35 80 L 95 5"/>
                </svg>
              {/if}
            </div>
            <p class='text-nowrap'>{item.name}</p>
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .hider {
    position: relative;
    display: inline-block;
  }
    
  .hider-content {
    display: none;
    position: absolute;
    background-color: #f6f6f6;
    min-width: 230px;
    border: 1px solid #ddd;
    z-index: 1;
  }

  .show {
    display:block;
  }

  .hider-btn {
    @apply px-2 py-1 rounded;
  }

  .active {
    @apply text-white bg-zinc-700 hover:bg-black;
  }

  .inactive {
    @apply text-zinc-500 bg-zinc-200 hover:cursor-default;
  }
</style>