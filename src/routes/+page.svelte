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
    <div class="bg-gradient-to-b from-blue-50 to-white">
      <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
            NeuroDB
          </h1>
          <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500 mb-8">
            Upload PDFs, extract text, and search through your documents using semantic search.
          </p>
          <div class="flex justify-center space-x-4 mb-12">
            <button
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              on:click={() => (activeTab = 'upload')}
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Files
            </button>
            <button
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
              on:click={() => (activeTab = 'search')}
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Documents
            </button>
            <a
              href="/docs"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Documentation
            </a>
          </div>
          <!-- Hero Image -->
          <div class="relative max-w-4xl mx-auto">
            <img
              src="/hero-illustration.svg"
              alt="NeuroDB Interface Preview"
              class="w-full h-auto rounded-lg shadow-xl"
            />
            <div class="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-600">Processing Complete</span>
              </div>
            </div>
          </div>
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
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} transition-colors duration-200"
            on:click={() => (activeTab = 'upload')}
          >
            Upload
          </button>
          <button
            class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'search'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} transition-colors duration-200"
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
    <div id="features" class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-12">
            Features
          </h2>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Semantic Search -->
          <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Semantic Search</h3>
            <p class="text-gray-500 mb-4">
              Search through your documents using natural language queries. Find relevant content even when the exact words don't match.
            </p>
            <img
              src="/semantic-search.svg"
              alt="Semantic Search Illustration"
              class="w-full h-48 object-cover rounded-lg"
            />
          </div>

          <!-- PDF Processing -->
          <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">PDF Processing</h3>
            <p class="text-gray-500 mb-4">
              Extract text and metadata from PDF files automatically. Process multiple pages and maintain document structure.
            </p>
            <img
              src="/pdf-processing.svg"
              alt="PDF Processing Illustration"
              class="w-full h-48 object-cover rounded-lg"
            />
          </div>

          <!-- Local Storage -->
          <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Local Storage</h3>
            <p class="text-gray-500 mb-4">
              All data is stored locally in your browser for privacy. Your documents never leave your device.
            </p>
            <img
              src="/local-storage.svg"
              alt="Local Storage Illustration"
              class="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>

        <!-- Stats Section -->
        <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div class="bg-blue-50 rounded-lg p-6 text-center">
            <div class="text-4xl font-bold text-blue-600 mb-2">90%</div>
            <div class="text-gray-600">Faster Search</div>
          </div>
          <div class="bg-green-50 rounded-lg p-6 text-center">
            <div class="text-4xl font-bold text-green-600 mb-2">100%</div>
            <div class="text-gray-600">Privacy Guaranteed</div>
          </div>
          <div class="bg-purple-50 rounded-lg p-6 text-center">
            <div class="text-4xl font-bold text-purple-600 mb-2">30%</div>
            <div class="text-gray-600">More Accurate Results</div>
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
        : notification.type === 'error'
        ? 'bg-red-500'
        : 'bg-blue-500'} text-white transform transition-all duration-300 ease-in-out"
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
