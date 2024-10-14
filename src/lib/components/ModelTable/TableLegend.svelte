<script lang="ts">
  import TableIcon from "./TableIcon.svelte";

  type TableIconProps = {
    icons: {
      text: string;
      value: number;
    }[];
  }

  let { icons }: TableIconProps = $props();
</script>

<div class='grid grid-cols-3 box-border border border-zinc-600 p-2 rounded'>
  {#each icons as { text, value }}
    <div class='flex flex-col items-center justify-center gap-1'>
      <TableIcon {value} />
      <p class='text-xs text-zinc-600'>{text}</p>
    </div>
  {/each}
</div>