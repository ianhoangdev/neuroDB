import { pipeline } from '@xenova/transformers';

const CHUNK_SIZE = 500; // Number of characters per chunk
const CHUNK_OVERLAP = 50; // Number of characters to overlap between chunks

let embedder = null;

/**
 * Initialize the embedding model
 * @returns {Promise<void>}
 */
async function initializeEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
}

/**
 * Split text into overlapping chunks
 * @param {string} text - The text to split
 * @param {Object} metadata - Metadata to attach to each chunk
 * @returns {Array<{text: string, metadata: Object}>} Array of text chunks with metadata
 */
export function chunkText(text, metadata = {}) {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    let chunk = text.slice(start, end);
    
    // Try to break at a sentence or paragraph
    if (end < text.length) {
      const lastPeriod = chunk.lastIndexOf('.');
      const lastNewline = chunk.lastIndexOf('\n');
      const breakPoint = Math.max(lastPeriod, lastNewline);
      
      if (breakPoint > CHUNK_SIZE / 2) {
        chunk = chunk.slice(0, breakPoint + 1);
        start = start + breakPoint + 1;
      } else {
        start = end - CHUNK_OVERLAP;
      }
    } else {
      start = end;
    }
    
    chunks.push({
      text: chunk.trim(),
      metadata: {
        ...metadata,
        chunkIndex: chunks.length,
        startChar: start - chunk.length,
        endChar: start
      }
    });
  }
  
  return chunks;
}

/**
 * Generate embeddings for text chunks
 * @param {Array<{text: string, metadata: Object}>} chunks - Array of text chunks with metadata
 * @returns {Promise<{vectors: Array<Array<number>>, metadata: Array<Object>}>} Vectorized chunks with metadata
 */
export async function vectorizeChunks(chunks) {
  try {
    await initializeEmbedder();
    
    const vectors = [];
    const metadata = [];
    
    for (const chunk of chunks) {
      const output = await embedder(chunk.text, {
        pooling: 'mean',
        normalize: true
      });
      
      vectors.push(Array.from(output.data));
      metadata.push(chunk.metadata);
    }
    
    return { vectors, metadata };
  } catch (error) {
    console.error('Error vectorizing chunks:', error);
    throw error;
  }
}

/**
 * Process a text document: chunk it and vectorize the chunks
 * @param {string} text - The text to process
 * @param {Object} metadata - Metadata to attach to each chunk
 * @returns {Promise<{vectors: Array<Array<number>>, metadata: Array<Object>}>} Vectorized chunks with metadata
 */
export async function processDocument(text, metadata = {}) {
  const chunks = chunkText(text, metadata);
  return await vectorizeChunks(chunks);
} 