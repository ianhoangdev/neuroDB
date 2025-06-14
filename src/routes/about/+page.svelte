<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
</script>

<div class="min-h-screen bg-gray-50">
  <main class="pt-20">
    <!-- Hero Section -->
    <div class="bg-gradient-to-b from-blue-50 to-white">
      <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
            About NeuroDB
          </h1>
          <p class="mt-5 max-w-3xl mx-auto text-xl text-gray-500">
            A powerful, privacy-focused document search engine that runs entirely in your browser.
          </p>
        </div>
      </div>
    </div>

    <!-- Mission Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white rounded-lg shadow-lg p-8 mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
        <p class="text-lg text-gray-600 mb-6">
          NeuroDB was created with a simple mission: to provide powerful document search capabilities while maintaining complete privacy. We believe that your documents should stay on your device, and you should have full control over your data.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Privacy First</h3>
            <p class="text-gray-500">All processing happens locally in your browser. Your documents never leave your device.</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Lightning Fast</h3>
            <p class="text-gray-500">Optimized for speed with efficient indexing and search algorithms.</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Open Source</h3>
            <p class="text-gray-500">Built with transparency in mind. View and contribute to our code on GitHub.</p>
          </div>
        </div>
      </div>

      <!-- Technology Stack -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Technology Stack</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Frontend</h3>
            <ul class="space-y-3">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">SvelteKit for the UI framework</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">Tailwind CSS for styling</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">PDF.js for document processing</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Core Features</h3>
            <ul class="space-y-3">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">IndexedDB for local storage</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">Hugging Face for embeddings</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">Semantic search algorithms</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
        <p class="text-lg text-gray-600 mb-8">
          Have questions or suggestions? We'd love to hear from you. Reach out to us through GitHub or contribute to the project.
        </p>
        <div class="flex justify-center space-x-4">
          <a
            href="https://github.com/ianhoangdev/neuroDB"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            View on GitHub
          </a>
          <a
            href="/docs"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Read Documentation
          </a>
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