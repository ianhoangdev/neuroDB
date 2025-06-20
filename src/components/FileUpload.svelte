<script>
  import { createEventDispatcher } from 'svelte';
  import { extractTextFromPDF, getPDFMetadata } from '$lib/pdfUtils';
  import { processDocument } from '$lib/vectorUtils';
  
  const dispatch = createEventDispatcher();
  let dragOver = false;
  let fileInput;
  let isProcessing = false;
  let processingProgress = 0;

  async function processFile(file) {
    try {
      isProcessing = true;
      processingProgress = 0;

      // Extract text and metadata from PDF
      const [text, metadata] = await Promise.all([
        extractTextFromPDF(file),
        getPDFMetadata(file)
      ]);

      console.log('PDF processed:', {
        fileName: file.name,
        textLength: text?.length,
        metadata
      });

      processingProgress = 50;

      // Process the document: chunk and vectorize
      const { vectors, metadata: chunkMetadata } = await processDocument(text, {
        ...metadata,
        fileName: file.name
      });

      console.log('Document processed:', {
        fileName: file.name,
        vectorsCount: vectors?.length,
        chunksCount: chunkMetadata?.length,
        firstChunkText: chunkMetadata?.[0]?.text?.substring(0, 50) + '...'
      });

      processingProgress = 100;

      // Dispatch the processed file event
      dispatch('fileProcessed', {
        name: file.name,
        type: file.type,
        size: file.size,
        text,
        metadata,
        vectors,
        chunkMetadata
      });

      return true;
    } catch (error) {
      console.error('Error processing file:', error);
      dispatch('error', error.message);
      return false;
    } finally {
      isProcessing = false;
      processingProgress = 0;
    }
  }

  async function handleFiles(files) {
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      dispatch('error', {
        message: 'Please upload PDF files only'
      });
      return;
    }

    for (const file of pdfFiles) {
      await processFile(file);
    }
  }

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
    handleFiles(files);
  }

  function handleFileSelect(event) {
    const files = event.target.files;
    handleFiles(files);
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
    accept=".pdf"
    class="hidden"
  />
  
  <div class="space-y-4">
    {#if isProcessing}
      <div class="flex flex-col items-center space-y-2">
        <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p class="text-sm text-gray-600">Processing PDF... {processingProgress}%</p>
      </div>
    {:else}
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
      <p class="text-sm text-gray-500">PDF files only</p>
    {/if}
  </div>
</div> 