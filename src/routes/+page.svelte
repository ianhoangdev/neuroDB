<script>
  import { onMount } from 'svelte';
  import FileUpload from '../components/FileUpload.svelte';
  import SearchBar from '../components/SearchBar.svelte';
  import FileList from '../components/FileList.svelte';
  
  let files = [];
  let searchResults = [];
  let isSearching = false;
  let activeTab = 'upload'; // 'upload' or 'search'
  let showFeatures = false;
  let notification = null;

  function handleFileUpload(event) {
    const { file, text, metadata, type } = event.detail;
    
    // Add the processed file to the list
    files = [...files, {
      id: Date.now(),
      name: file.name,
      type,
      size: file.size,
      text,
      metadata,
      uploadedAt: new Date()
    }];

    showNotification('File uploaded and processed successfully!');
  }

  function handleError(event) {
    showNotification(event.detail.message, 'error');
  }

  function handleSearch(event) {
    const query = event.detail;
    isSearching = true;

    // Simple text search implementation
    searchResults = files.map(file => {
      const matches = file.text.toLowerCase().includes(query.toLowerCase());
      return matches ? {
        ...file,
        relevance: matches ? 1 : 0
      } : null;
    }).filter(Boolean);

    isSearching = false;
    showNotification(`Found ${searchResults.length} results`);
  }

  function showNotification(message, type = 'success') {
    notification = { message, type };
    setTimeout(() => {
      notification = null;
    }, 3000);
  }

  onMount(() => {
    // Animate features section on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          showFeatures = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      observer.observe(featuresSection);
    }

    return () => observer.disconnect();
  });
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Hero Section -->
  <div class="bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          NeuroDB
        </h1>
        <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Upload your PDFs and search through them semantically. Built with privacy and performance in mind.
        </p>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Tabs -->
    <div class="border-b border-gray-200 mb-8">
      <nav class="-mb-px flex space-x-8">
        <button
          class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'upload' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => activeTab = 'upload'}
        >
          Upload
        </button>
        <button
          class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'search' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => activeTab = 'search'}
        >
          Search
        </button>
      </nav>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-8">
        {#if activeTab === 'upload'}
          <FileUpload on:upload={handleFileUpload} on:error={handleError} />
        {:else}
          <SearchBar on:search={handleSearch} />
        {/if}
      </div>
      <div>
        <FileList {files} {searchResults} {isSearching} />
      </div>
    </div>
  </div>

  <!-- Features Section -->
  <div id="features" class="bg-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Features
        </h2>
        <p class="mt-4 text-lg text-gray-500">
          Everything you need to manage and search your documents
        </p>
      </div>

      <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div class="transform transition-all duration-500 {showFeatures ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}" style="transition-delay: 0ms">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">Semantic Search</h3>
            <p class="mt-2 text-gray-500">Search through your documents using natural language queries</p>
          </div>
        </div>

        <div class="transform transition-all duration-500 {showFeatures ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}" style="transition-delay: 100ms">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">PDF Processing</h3>
            <p class="mt-2 text-gray-500">Extract text and metadata from your PDF documents</p>
          </div>
        </div>

        <div class="transform transition-all duration-500 {showFeatures ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}" style="transition-delay: 200ms">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">Local Storage</h3>
            <p class="mt-2 text-gray-500">Your documents stay on your device, ensuring privacy</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Notification -->
{#if notification}
  <div class="fixed bottom-4 right-4 z-50">
    <div class="bg-white rounded-lg shadow-lg p-4 {notification.type === 'error' ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'}">
      <p class="text-sm {notification.type === 'error' ? 'text-red-600' : 'text-green-600'}">
        {notification.message}
      </p>
    </div>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
  }
</style>
