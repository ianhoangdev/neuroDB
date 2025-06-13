<script>
  export let files = [];
  export let searchResults = [];

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

<div class="space-y-4">
  {#if searchResults.length > 0}
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Search Results</h3>
      </div>
      <ul class="divide-y divide-gray-200">
        {#each searchResults as result}
          <li class="px-4 py-3 hover:bg-gray-50 transition-colors duration-150">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-900">{result.fileName}</p>
                  <p class="text-xs text-gray-500">Relevance: {Math.round(result.score * 100)}%</p>
                </div>
              </div>
              <div class="text-sm text-gray-500">
                {new Date(result.timestamp).toLocaleDateString()}
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {:else if files.length > 0}
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Uploaded Files</h3>
      </div>
      <ul class="divide-y divide-gray-200">
        {#each files as file}
          <li class="px-4 py-3 hover:bg-gray-50 transition-colors duration-150">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-900">{file.name}</p>
                  <p class="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <div class="text-sm text-gray-500">
                {new Date(file.lastModified).toLocaleDateString()}
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {:else}
    <div class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No files uploaded</h3>
      <p class="mt-1 text-sm text-gray-500">Upload your first document to get started.</p>
    </div>
  {/if}
</div> 