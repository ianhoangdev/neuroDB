import { pipeline } from '@xenova/transformers';
import { storeEmbedding, searchSimilar } from './db';

const CHUNK_SIZE = 500; // Number of characters per chunk
const CHUNK_OVERLAP = 50; // Number of characters to overlap between chunks

let embedder = null;

/**
 * Initialize the embedding model
 */
async function initEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
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
    
    const trimmedChunk = chunk.trim();
    if (trimmedChunk) {
      chunks.push({
        text: trimmedChunk,
        metadata: {
          ...metadata,
          text: trimmedChunk,
          chunkIndex: chunks.length,
          startChar: start - chunk.length,
          endChar: start
        }
      });
    }
  }
  
  return chunks;
}

/**
 * Vectorize text chunks using Transformers.js
 * @param {Array<{text: string, metadata: Object}>} chunks - Array of text chunks with metadata
 * @returns {Promise<{vectors: Array<Array<number>>, metadata: Array<Object>}>} Vectorized chunks with metadata
 */
export async function vectorizeChunks(chunks) {
  try {
    const embedder = await initEmbedder();
    const vectors = [];
    const metadata = [];
    
    for (const chunk of chunks) {
      const output = await embedder(chunk.text, {
        pooling: 'mean',
        normalize: true
      });
      const vector = Array.from(output.data);
      vectors.push(vector);
      metadata.push(chunk.metadata);
    }
    
    return {
      vectors,
      metadata
    };
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
export async function processDocument(text, metadata) {
  if (!text) {
    throw new Error('No text provided for processing');
  }

  if (!metadata?.fileName) {
    throw new Error('No fileName provided in metadata');
  }

  console.log('Processing document:', {
    fileName: metadata.fileName,
    textLength: text.length
  });

  // Split text into chunks
  const chunks = chunkText(text);
  console.log('Created chunks:', chunks.length);

  // Generate embeddings for each chunk
  const vectors = [];
  const chunkMetadata = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const vector = await generateEmbedding(chunk.text);
    
    vectors.push(vector);
    chunkMetadata.push({
      text: chunk.text,
      index: i,
      fileName: metadata.fileName,
      timestamp: Date.now()
    });

    console.log('Processed chunk:', {
      index: i,
      textPreview: chunk.text.substring(0, 50) + '...',
      vectorLength: vector.length,
      fileName: metadata.fileName
    });
  }

  return { vectors, metadata: chunkMetadata };
}

async function generateEmbedding(text) {
  const embedder = await initEmbedder();
  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true
  });
  return Array.from(output.data);
}

export async function searchSimilarChunks(queryText, limit = 5) {
  try {
    const embedder = await initEmbedder();
    const output = await embedder(queryText, {
      pooling: 'mean',
      normalize: true
    });
    const queryVector = Array.from(output.data);
    
    return await searchSimilar(queryVector, limit);
  } catch (error) {
    console.error('Error searching similar chunks:', error);
    throw error;
  }
} 