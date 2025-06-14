<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  export let files = [];
  export let searchResults = [];
  export let isSearching = false;

  const ITEMS_PER_PAGE = 5;
  let currentPage = 1;

  $: totalPages = Math.ceil((searchResults.length || files.length) / ITEMS_PER_PAGE);
  $: startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  $: endIndex = startIndex + ITEMS_PER_PAGE;
  $: displayedItems = searchResults.length > 0 
    ? searchResults.slice(startIndex, endIndex)
    : files.slice(startIndex, endIndex);

  $: console.log('FileList received files:', files);
  $: console.log('FileList received searchResults:', searchResults);

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString();
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function getTextPreview(text) {
    if (!text) return '';
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  }

  function getFileIcon(type) {
    if (type.includes('pdf')) {
      return '📄';
    }
    if (type.includes('text')) {
      return '📝';
    }
    return '📁';
  }

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
    }
  }

  function previousPage() {
    if (currentPage > 1) {
      currentPage--;
    }
  }

  function handleDelete(fileName) {
    if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
      dispatch('delete', fileName);
    }
  }

  // Reset to first page when switching between search and files
  $: {
    currentPage = 1;
  }
</script>

<div class="bg-white rounded-lg shadow-sm">
  {#if isSearching}
    <div class="h-[400px] flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
        <p class="mt-2 text-sm text-gray-600">Searching...</p>
      </div>
    </div>
  {:else if searchResults.length > 0}
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Search Results</h3>
      <p class="text-sm text-gray-500">{searchResults.length} results found</p>
    </div>
    <div class="h-[400px] overflow-y-auto">
      <div class="divide-y divide-gray-200">
        {#each displayedItems as result}
          <div class="p-4 hover:bg-gray-50">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-blue-600">
                    {Math.round(result.similarity * 100)}% match
                  </span>
                  <span class="text-sm text-gray-500">
                    {result.fileName}
                  </span>
                </div>
                <p class="text-sm text-gray-900">{getTextPreview(result.text)}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else if files.length > 0}
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Uploaded Files</h3>
      <p class="text-sm text-gray-500">{files.length} files</p>
    </div>
    <div class="h-[400px] overflow-y-auto">
      <div class="divide-y divide-gray-200">
        {#each displayedItems as file}
          <div class="p-4 hover:bg-gray-50 group">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">{file.name}</h4>
                <p class="mt-1 text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </p>
                {#if file.metadata?.pageCount}
                  <p class="mt-1 text-sm text-gray-500">
                    {file.metadata.pageCount} pages
                  </p>
                {/if}
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-sm text-gray-500">
                  {formatDate(file.timestamp)}
                </div>
                <button
                  on:click={() => handleDelete(file.name)}
                  class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-600 hover:text-red-800"
                  title="Delete file"
                  aria-label="Delete {file.name}"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="h-[400px] flex items-center justify-center">
      <div class="text-center m-10">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-1">No files uploaded yet</h3>
        <p class="text-sm text-gray-500">Upload your first PDF document to get started</p>
      </div>
    </div>
  {/if}

  {#if (searchResults.length > 0 || files.length > 0) && totalPages > 1}
    <div class="px-4 py-3 flex items-center justify-between border-t border-gray-200">
      <div class="flex-1 flex justify-between">
        <button
          on:click={previousPage}
          disabled={currentPage === 1}
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div class="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
        <button
          on:click={nextPage}
          disabled={currentPage === totalPages}
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  {/if}
</div> 