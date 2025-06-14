<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  export let isSearching = false;
  
  let query = '';
  let debounceTimeout;
  let searchInput;

  function handleInput(event) {
    query = event.target.value;
    
    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    // Set new timeout for debouncing
    debounceTimeout = setTimeout(() => {
      if (query.trim()) {
        dispatch('search', query);
      }
    }, 300);
  }

  // Focus the input when the component mounts
  function focusInput() {
    if (searchInput) {
      searchInput.focus();
    }
  }

  // Focus the input when isSearching changes to false
  $: if (!isSearching && searchInput) {
    searchInput.focus();
  }
</script>

<div class="w-full">
  <div class="relative">
    <input
      bind:this={searchInput}
      type="text"
      bind:value={query}
      on:input={handleInput}
      placeholder="Search your documents..."
      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      disabled={isSearching}
    />
    {#if isSearching}
      <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div class="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    {/if}
  </div>
</div> 