<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  let dragOver = false;
  let fileInput;

  function handleDragOver(event) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function handleDrop(event) {
    event.preventDefault();
    dragOver = false;
    const files = event.dataTransfer.files;
    dispatch('upload', files);
  }

  function handleFileSelect(event) {
    const files = event.target.files;
    dispatch('upload', files);
  }

  function triggerFileInput() {
    fileInput.click();
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      triggerFileInput();
    }
  }
</script>

<div
  role="button"
  tabindex="0"
  class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 {dragOver ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}"
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
  on:click={triggerFileInput}
  on:keydown={handleKeydown}
>
  <input
    type="file"
    bind:this={fileInput}
    on:change={handleFileSelect}
    multiple
    accept=".pdf,.txt"
    class="hidden"
  />
  
  <div class="space-y-4">
    <div class="flex justify-center">
      <div class="p-3 bg-blue-50 rounded-full">
        <svg
          class="h-8 w-8 text-blue-500"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div class="text-gray-600">
      <span class="font-medium text-blue-600">Click to upload</span> or drag and drop
    </div>
    <p class="text-sm text-gray-500">PDF, TXT files up to 10MB</p>
  </div>
</div> 