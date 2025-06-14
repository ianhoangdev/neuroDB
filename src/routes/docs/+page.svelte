<script>
  let activeSection = 'getting-started';
</script>

<div class="min-h-screen bg-gray-50">
  <main class="pt-20">
    <!-- Hero Section -->
    <div class="bg-gradient-to-b from-blue-50 to-white">
      <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
            Documentation
          </h1>
          <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Learn how to use NeuroDB effectively
          </p>
        </div>
      </div>
    </div>

    <!-- Documentation Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <nav class="sticky top-24 space-y-1">
            <button
              class="w-full text-left px-4 py-2 rounded-lg {activeSection === 'getting-started'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'} transition-colors duration-200"
              on:click={() => (activeSection = 'getting-started')}
            >
              Getting Started
            </button>
            <button
              class="w-full text-left px-4 py-2 rounded-lg {activeSection === 'uploading'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'} transition-colors duration-200"
              on:click={() => (activeSection = 'uploading')}
            >
              Uploading Files
            </button>
            <button
              class="w-full text-left px-4 py-2 rounded-lg {activeSection === 'searching'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'} transition-colors duration-200"
              on:click={() => (activeSection = 'searching')}
            >
              Searching Documents
            </button>
            <button
              class="w-full text-left px-4 py-2 rounded-lg {activeSection === 'privacy'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'} transition-colors duration-200"
              on:click={() => (activeSection = 'privacy')}
            >
              Privacy & Security
            </button>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow-sm p-8">
            {#if activeSection === 'getting-started'}
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
                <div class="prose prose-blue max-w-none">
                  <p class="text-gray-600 mb-4">
                    NeuroDB is a powerful document management system that uses semantic search to help you find information in your PDF documents quickly and efficiently.
                  </p>
                  <div class="bg-blue-50 rounded-lg p-4 mb-6">
                    <h3 class="text-lg font-medium text-blue-900 mb-2">Key Features</h3>
                    <ul class="list-disc list-inside text-blue-800 space-y-2">
                      <li>Semantic search across PDF documents</li>
                      <li>Local storage for privacy</li>
                      <li>Automatic text extraction</li>
                      <li>Smart document chunking</li>
                    </ul>
                  </div>
                </div>
              </div>
            {:else if activeSection === 'uploading'}
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Uploading Files</h2>
                <div class="prose prose-blue max-w-none">
                  <p class="text-gray-600 mb-4">
                    Upload your PDF documents to start using NeuroDB's semantic search capabilities.
                  </p>
                  <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">How to Upload</h3>
                    <ol class="list-decimal list-inside text-gray-700 space-y-2">
                      <li>Click the "Upload" tab</li>
                      <li>Drag and drop your PDF files or click to select</li>
                      <li>Wait for the processing to complete</li>
                      <li>Your files are now ready for searching</li>
                    </ol>
                  </div>
                </div>
              </div>
            {:else if activeSection === 'searching'}
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Searching Documents</h2>
                <div class="prose prose-blue max-w-none">
                  <p class="text-gray-600 mb-4">
                    Use natural language to search through your documents. NeuroDB understands the meaning behind your queries, not just the exact words.
                  </p>
                  <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Search Tips</h3>
                    <ul class="list-disc list-inside text-gray-700 space-y-2">
                      <li>Use natural language queries</li>
                      <li>Results are ranked by relevance</li>
                      <li>Each result shows similarity percentage</li>
                      <li>Click on results to view full context</li>
                    </ul>
                  </div>
                </div>
              </div>
            {:else if activeSection === 'privacy'}
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Privacy & Security</h2>
                <div class="prose prose-blue max-w-none">
                  <p class="text-gray-600 mb-4">
                    Your privacy is our top priority. All data is stored locally in your browser.
                  </p>
                  <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Key Points</h3>
                    <ul class="list-disc list-inside text-gray-700 space-y-2">
                      <li>No data is sent to external servers</li>
                      <li>All processing happens in your browser</li>
                      <li>Data is stored in your browser's IndexedDB</li>
                      <li>You can delete your data at any time</li>
                    </ul>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
  }
</style> 