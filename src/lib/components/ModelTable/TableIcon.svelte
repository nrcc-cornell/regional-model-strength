<script lang="ts">
  import { tableThresholds } from "$lib/constants";
  
  type TableIconProps = {
    value: number;
  }
  
  let { value }: TableIconProps = $props();

  let iconInfo = $derived.by(() => {
    if (value <= tableThresholds.low) {
      return {
        icon: 'arrows',
        color: '#c11111',
        rotation: 'rotate-90'
      }
    } else if (value >= tableThresholds.high) {
      return {
        icon: 'arrows',
        color: '#148721',
        rotation: '-rotate-90'
      }
    } else {
      return {
        icon: 'neutral',
        color: '#d2e847',
        rotation: 'rotate-0'
      }
    }
  });
</script>

<div class='w-full h-full flex justify-center items-center'>
  <div class='h-6 w-6 {iconInfo.rotation}'>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill={iconInfo.color} />
      {#if iconInfo.icon === "neutral"}
        <path d="m6 12.5 L18 12.5" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      {:else}
        <path d="m14.5 16.9 5-5-5-5 M6.75 16.9 l5-5-5-5" stroke="#eee" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      {/if}
    </svg>
  </div>
</div>