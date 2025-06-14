<script>
  import '../app.css';
  import { onMount } from 'svelte';
  
  let isScrolled = false;
  
  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 0;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<div class="min-h-screen flex flex-col bg-gray-50">
  <!-- Header -->
  <header class="fixed w-full z-50 transition-all duration-200 {isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'}">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center space-x-2">
        <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">NeuroDB</span>
        <span class="text-xs text-gray-500">v1.0.0</span>
      </a>
      <div class="flex items-center space-x-6">
        <a href="/docs" class="text-gray-600 hover:text-blue-600 transition-colors">Documentation</a>
        <a href="https://github.com/ianhoangdev/neuroDB" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-blue-600 transition-colors">GitHub</a>
        <a href="/" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Get Started
        </a>
      </div>
    </nav>
  </header>

  <!-- Main Content -->
  <main class="flex-grow pt-1">
    <slot />
  </main>

  <!-- Footer -->
  <footer class="bg-gray-50 border-t border-gray-200 mt-16">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div class="flex items-center space-x-2">
          <span class="text-xl font-bold text-gray-900">NeuroDB</span>
          <span class="text-sm text-gray-500">•</span>
          <span class="text-sm text-gray-500">Your local document search assistant</span>
        </div>
        <div class="flex items-center space-x-6">
          <a href="/about" class="text-sm text-gray-500 hover:text-gray-900">About</a>
          <a href="/docs" class="text-sm text-gray-500 hover:text-gray-900">Documentation</a>
          <a href="https://github.com/ianhoangdev/neuroDB" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-500 hover:text-gray-900">GitHub</a>
          <span class="text-sm text-gray-400">© 2025</span>
        </div>
      </div>
    </div>
  </footer>
</div> 