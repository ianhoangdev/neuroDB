<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  let query = '';

  function handleSearch() {
    dispatch('search', query);
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }
</script>

<div class="relative">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
  <input
    type="text"
    bind:value={query}
    on:keydown={handleKeydown}
    placeholder="Search your documents..."
    class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
  />
  <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
    <button
      on:click={handleSearch}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
    >
      Search
    </button>
  </div>
</div> 