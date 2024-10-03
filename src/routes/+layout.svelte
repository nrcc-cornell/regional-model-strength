<script>
  import "../app.css";
</script>

<main class='flex flex-col min-h-[100vh] relative min-w-80 overflow-hidden'>
  <div class='column h-full flex flex-col flex-1 overflow-y-auto bg-gray-100'>
    <!-- <Banner />
    <NavDrawer />
    <Header /> -->
    <div class='flex'>
      <!-- <NavSidebar /> -->
      <slot />
    </div>
  </div>
  <!-- <div class='column'>
    <Footer />
  </div> -->
</main>

<!-- {#if $page.status === 200 && ($loadingOverlayData || $isInitialLoad)}
  <Loading isInitial={$isInitialLoad} />
{/if} -->

<style>
  .column {
    @apply w-full lg:w-11/12 max-w-7xl min-w-6 lg:border-x-2 border-gray-300 m-0 lg:mx-auto;
  }
</style>