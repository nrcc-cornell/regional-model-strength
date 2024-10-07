<script lang="ts">
  const seasonOptions = ['Winter', 'Spring', 'Summer', 'Fall', 'Annual'];
  
  type SeasonSelectorProps = {
    selected: string|null
  }

  let {
    selected = $bindable()
  }: SeasonSelectorProps = $props();

  // Allows selected to be defined in parent and passed in while maintaining the default value on initial load
  if (selected === null) {
    selected = seasonOptions[0];
  }
</script>

<div
  role="radiogroup" 
  aria-labelledby='label-season-selector'
  id='group-season-selector'
>
  <div
    id='label-season-selector'
    class='font-bold text-center'
  >Season</div>

  <div
  class='relative w-fit flex mx-auto'
  >
    <div class='absolute bg-sky-500 h-1 left-8 bottom-2' style='width: calc(100% - 64px);' ></div>

    {#each seasonOptions as name}
      <div
        class='flex flex-col items-center w-16 z-10'
      >
        <label
          for={name}
        >{name}</label>
        
        <input
          class='bg-sky-600 border-2 border-sky-900 rounded-full m-0 appearance-none h-5 w-5 grid place-content-center'
          type="radio"
          id={name}
          bind:group={selected}
          value={name}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  :root {
    --dot-size: 1.0em;
  }

  input[type="radio"]::before {
    content: "";
    width: var(--dot-size);
    height: var(--dot-size);
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset var(--dot-size) var(--dot-size) #7dd3fc;
  }

  input[type="radio"]:checked {
    border-color: #38bdf8;
  }

  input[type="radio"]:checked::before {
    transform: scale(1);
  }
</style>