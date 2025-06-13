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

  function handleFileUpload(event) {
    const newFiles = Array.from(event.detail);
    files = [...files, ...newFiles];
    // Show success notification
    showNotification('Files uploaded successfully!');
  }

  async function handleSearch(event) {
    const query = event.detail;
    isSearching = true;
    // TODO: Implement search functionality
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate search
    isSearching = false;
    showNotification('Search completed!');
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-y-0 opacity-100';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  onMount(() => {
    // Animate features section on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          showFeatures = true;
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

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <!-- Hero Section -->
  <div class="text-center mb-16">
    <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
      NeuroDB
    </h1>
    <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
      A powerful local-first web app for semantic search over your documents. Upload PDFs, search naturally, and find exactly what you need.
    </p>
  </div>

  <!-- Main Content -->
  <div class="grid gap-8 lg:grid-cols-2">
    <!-- Left Column -->
    <div class="space-y-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex">
            <button
              class="flex-1 px-4 py-3 text-center font-medium {activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}"
              on:click={() => activeTab = 'upload'}
            >
              Upload Files
            </button>
            <button
              class="flex-1 px-4 py-3 text-center font-medium {activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}"
              on:click={() => activeTab = 'search'}
            >
              Search
            </button>
          </nav>
        </div>
        <div class="p-6">
          {#if activeTab === 'upload'}
            <FileUpload on:upload={handleFileUpload} />
          {:else}
            <SearchBar on:search={handleSearch} />
          {/if}
        </div>
      </div>
    </div>

    <!-- Right Column -->
    <section class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Files</h2>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">{files.length} files</span>
          {#if files.length > 0}
            <button
              class="text-sm text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md px-2 py-1"
              on:click={() => files = []}
            >
              Clear All
            </button>
          {/if}
        </div>
      </div>
      <FileList {files} {searchResults} />
    </section>
  </div>

  <!-- Features Section -->
  <div id="features" class="mt-24 grid gap-8 md:grid-cols-3">
    <div class="transform transition-all duration-500 {showFeatures ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}" style="transition-delay: 0ms">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div class="text-blue-600 text-2xl mb-4">🔍</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Semantic Search</h3>
        <p class="text-gray-600">Find relevant content using natural language queries</p>
      </div>
    </div>
    <div class="transform transition-all duration-500 {showFeatures ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}" style="transition-delay: 150ms">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div class="text-blue-600 text-2xl mb-4">📄</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">PDF Processing</h3>
        <p class="text-gray-600">Extract and search through PDF documents easily</p>
      </div>
    </div>
    <div class="transform transition-all duration-500 {showFeatures ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}" style="transition-delay: 300ms">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div class="text-blue-600 text-2xl mb-4">🔒</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Local Storage</h3>
        <p class="text-gray-600">Your data stays on your device, ensuring privacy</p>
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
  }
</style>
