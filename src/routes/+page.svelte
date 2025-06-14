<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import FileUpload from '../components/FileUpload.svelte';
  import SearchBar from '../components/SearchBar.svelte';
  import FileList from '../components/FileList.svelte';
  import { searchSimilarChunks } from '$lib/vectorUtils';
  import { initDB, storeFile, getFiles, deleteFile, storeEmbedding } from '$lib/db';

  let files = [];
  let searchResults = [];
  let isSearching = false;
  let activeTab = 'upload';
  let showFeatures = false;
  let notification = null;
  let featuresSection;

  async function loadFiles() {
    try {
      console.log('Loading files from IndexedDB...');
      await initDB();
      const loadedFiles = await getFiles();
      console.log('Loaded files:', loadedFiles);
      files = loadedFiles;
    } catch (error) {
      console.error('Error loading files:', error);
      showNotification('error', 'Failed to load saved files');
    }
  }

  async function handleFileProcessed(event) {
    const { name, type, size, text, metadata, vectors, chunkMetadata } = event.detail;
    console.log('File processed event received:', { 
      name, 
      type, 
      size, 
      textLength: text?.length,
      vectorsCount: vectors?.length,
      chunksCount: chunkMetadata?.length,
      firstChunkText: chunkMetadata?.[0]?.text?.substring(0, 50) + '...'
    });
    
    const fileData = {
      name,
      type,
      size,
      text,
      metadata,
      vectors,
      chunkMetadata,
      timestamp: Date.now()
    };
    
    try {
      // Store file data
      await storeFile(fileData);
      
      // Store embeddings
      for (let i = 0; i < vectors.length; i++) {
        const chunkText = chunkMetadata[i]?.text;
        if (!chunkText) {
          console.error('Missing text for chunk:', i, chunkMetadata[i]);
          continue;
        }
        
        console.log('Storing embedding for chunk:', {
          chunkIndex: i,
          textPreview: chunkText.substring(0, 50) + '...',
          vectorLength: vectors[i].length,
          fileName: name
        });
        
        try {
          await storeEmbedding(
            chunkText,
            vectors[i],
            name
          );
        } catch (error) {
          console.error('Error storing embedding for chunk:', i, error);
          throw error;
        }
      }
      
      files = [...files, fileData];
      console.log('Updated files array:', files);
      showNotification('success', `Successfully processed ${name}`);
    } catch (error) {
      console.error('Error storing file:', error);
      showNotification('error', 'Failed to store file data');
    }
  }

  function handleError(event) {
    showNotification('error', event.detail);
  }

  async function handleSearch(event) {
    const query = event.detail;
    if (!query.trim()) {
      searchResults = [];
      return;
    }

    isSearching = true;
    try {
      const results = await searchSimilarChunks(query);
      searchResults = results;
      if (results.length > 0) {
        showNotification('success', `Found ${results.length} similar chunks`);
      } else {
        showNotification('info', 'No matching results found');
      }
    } catch (error) {
      console.error('Search error:', error);
      showNotification('error', 'Search failed: ' + error.message);
      searchResults = [];
    } finally {
      isSearching = false;
    }
  }

  async function handleDelete(fileName) {
    try {
      await deleteFile(fileName);
      files = files.filter(f => f.name !== fileName);
      showNotification('success', `Deleted ${fileName}`);
    } catch (error) {
      console.error('Error deleting file:', error);
      showNotification('error', `Failed to delete ${fileName}`);
    }
  }

  function showNotification(type, message) {
    notification = { type, message };
    setTimeout(() => {
      notification = null;
    }, 3000);
  }

  onMount(() => {
    console.log('Component mounted, loading files...');
    loadFiles();
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showFeatures = true;
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      observer.observe(featuresSection);
    }
  });
</script>

<div class="min-h-screen bg-gray-50">
  <main class="pt-20">
    <!-- Hero Section -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            NeuroDB
          </h1>
          <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Upload PDFs, extract text, and search through your documents using semantic search.
          </p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'upload'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            on:click={() => (activeTab = 'upload')}
          >
            Upload
          </button>
          <button
            class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'search'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            on:click={() => (activeTab = 'search')}
          >
            Search
          </button>
        </nav>
      </div>

      <div class="mt-8">
        {#if activeTab === 'upload'}
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FileUpload on:fileProcessed={handleFileProcessed} on:error={handleError} />
            <FileList {files} searchResults={[]} isSearching={false} on:delete={({ detail }) => handleDelete(detail)} />
          </div>
        {:else}
          <div class="space-y-8">
            <SearchBar on:search={handleSearch} {isSearching} />
            <FileList files={[]} {searchResults} {isSearching} on:delete={({ detail }) => handleDelete(detail)} />
          </div>
        {/if}
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="bg-white py-16 {showFeatures ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Features
          </h2>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Semantic Search -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900">Semantic Search</h3>
            <p class="mt-2 text-gray-500">
              Search through your documents using natural language queries.
            </p>
          </div>

          <!-- PDF Processing -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900">PDF Processing</h3>
            <p class="mt-2 text-gray-500">
              Extract text and metadata from PDF files automatically.
            </p>
          </div>

          <!-- Local Storage -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900">Local Storage</h3>
            <p class="mt-2 text-gray-500">
              All data is stored locally in your browser for privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Notification -->
  {#if notification}
    <div
      class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg {notification.type === 'success'
        ? 'bg-green-500'
        : 'bg-red-500'} text-white"
      transition:fade
    >
      {notification.message}
    </div>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
  }
</style>
