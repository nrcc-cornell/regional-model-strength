<script lang="ts">
  type SliderSelectorProps = {
    selected: NamesObj|null;
    options: NamesObj[];
    label: string;
    spacing?: 'small'|'large';
    disabled?: boolean;
  }

  let {
    selected = $bindable(),
    options,
    label,
    spacing = 'small',
    disabled = false
  }: SliderSelectorProps = $props();

  // Allows selected to be defined in parent and passed in while maintaining the default value on initial load
  if (selected === null) {
    selected = options[0];
  }
</script>

<div
  role="radiogroup" 
  aria-labelledby='label-slider-selector'
  id='group-slider-selector'
>
  <div
    id='label-slider-selector'
    class='font-bold text-center'
  >{label}</div>

  <div
    class='relative w-fit flex mx-auto'
  >
    <div class={`absolute ${disabled ? "bg-gray-300" : "bg-sky-500"} h-1 ${spacing === 'small' ? 'left-8' : 'left-12'} bottom-2`} style={`width: calc(100% - ${spacing === 'small' ? 64 : 94}px);`} ></div>

    {#each options as option}
      <div
        class={`flex flex-col items-center ${spacing === 'small' ? 'w-16' : 'w-28'} z-10`}
      >
        <label
          for={option.name}
        >{option.name}</label>
        
        <input
          class={`${disabled ? "bg-gray-300 border-gray-400" : "bg-sky-600 border-sky-900"} border-2 rounded-full m-0 appearance-none h-5 w-5 grid place-content-center`}
          type="radio"
          id={option.name}
          oninput={() => {
            selected = option;
          }}
          {disabled}
          checked={selected && option.name === selected.name}
          value={option.name}
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

  input[type="radio"]:hover {
    cursor: pointer;
  }

  input[type="radio"]:checked {
    border-color: #38bdf8;
  }

  input[type="radio"]:checked::before {
    transform: scale(1);
  }
</style>