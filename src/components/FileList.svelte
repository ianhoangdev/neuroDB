<script>
  export let files = [];
  export let searchResults = [];
  export let isSearching = false;

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
</script>

<div class="bg-white rounded-lg shadow-sm">
  {#if isSearching}
    <div class="p-4 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
      <p class="mt-2 text-sm text-gray-600">Searching...</p>
    </div>
  {:else if searchResults.length > 0}
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Search Results</h3>
      <p class="text-sm text-gray-500">{searchResults.length} results found</p>
    </div>
    <div class="divide-y divide-gray-200">
      {#each searchResults as result}
        <div class="p-4 hover:bg-gray-50">
          <div class="flex items-start justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900">{result.name}</h4>
              <p class="mt-1 text-sm text-gray-500">
                {result.metadata.pageCount} pages • {formatFileSize(result.size)}
              </p>
              {#if result.metadata.author}
                <p class="mt-1 text-sm text-gray-500">Author: {result.metadata.author}</p>
              {/if}
            </div>
            <div class="text-sm text-gray-500">
              {formatDate(result.uploadedAt)}
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-600 line-clamp-2">
            {result.text.substring(0, 200)}...
          </div>
        </div>
      {/each}
    </div>
  {:else if files.length > 0}
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Uploaded Files</h3>
      <p class="text-sm text-gray-500">{files.length} files</p>
    </div>
    <div class="divide-y divide-gray-200">
      {#each files as file}
        <div class="p-4 hover:bg-gray-50">
          <div class="flex items-start justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900">{file.name}</h4>
              <p class="mt-1 text-sm text-gray-500">
                {file.metadata.pageCount} pages • {formatFileSize(file.size)}
              </p>
              {#if file.metadata.author}
                <p class="mt-1 text-sm text-gray-500">Author: {file.metadata.author}</p>
              {/if}
            </div>
            <div class="text-sm text-gray-500">
              {formatDate(file.uploadedAt)}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="p-8 text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">No files uploaded yet</h3>
      <p class="text-sm text-gray-500">Upload your first PDF document to get started</p>
    </div>
  {/if}
</div> 