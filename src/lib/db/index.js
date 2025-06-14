const DB_NAME = 'neurodb';
const EMBEDDINGS_STORE = 'embeddings';
const FILES_STORE = 'files';
const DB_VERSION = 8;

export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      console.log('Database opened successfully');
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      console.log('Database upgrade needed');
      const db = event.target.result;
      
      // Create or update embeddings store
      if (!db.objectStoreNames.contains(EMBEDDINGS_STORE)) {
        console.log('Creating embeddings store');
        const store = db.createObjectStore(EMBEDDINGS_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('fileName', 'metadata.fileName', { unique: false });
      } else {
        // Update existing store
        const store = event.target.transaction.objectStore(EMBEDDINGS_STORE);
        if (!store.indexNames.contains('fileName')) {
          store.createIndex('fileName', 'metadata.fileName', { unique: false });
        }
      }
      
      // Create or update files store
      if (!db.objectStoreNames.contains(FILES_STORE)) {
        console.log('Creating files store');
        const store = db.createObjectStore(FILES_STORE, { keyPath: 'name' });
      }
    };
  });
}

export async function storeFile(fileData) {
  console.log('Storing file:', fileData.name);
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FILES_STORE], 'readwrite');
    const store = transaction.objectStore(FILES_STORE);
    const request = store.put(fileData);

    request.onsuccess = () => {
      console.log('File stored successfully');
      resolve();
    };

    request.onerror = () => {
      console.error('Error storing file:', request.error);
      reject(request.error);
    };
  });
}

export async function getFiles() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FILES_STORE], 'readonly');
    const store = transaction.objectStore(FILES_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      console.log('Retrieved files:', request.result.length);
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Error retrieving files:', request.error);
      reject(request.error);
    };
  });
}

export async function deleteFile(fileName) {
  console.log('Starting deletion process for file:', fileName);
  const db = await initDB();
  
  // First delete from embeddings store
  await new Promise((resolve, reject) => {
    const transaction = db.transaction([EMBEDDINGS_STORE], 'readwrite');
    const store = transaction.objectStore(EMBEDDINGS_STORE);
    const index = store.index('fileName');
    const request = index.getAll(fileName);

    request.onsuccess = () => {
      const embeddings = request.result;
      console.log('Found embeddings to delete:', embeddings.length);
      
      if (embeddings.length === 0) {
        console.log('No embeddings found for file:', fileName);
        resolve();
        return;
      }

      const deletePromises = embeddings.map(embedding => {
        return new Promise((resolve, reject) => {
          const deleteRequest = store.delete(embedding.id);
          deleteRequest.onsuccess = () => {
            console.log('Deleted embedding with ID:', embedding.id);
            resolve();
          };
          deleteRequest.onerror = (error) => {
            console.error('Error deleting embedding:', error);
            reject(error);
          };
        });
      });

      Promise.all(deletePromises)
        .then(() => {
          console.log('All embeddings deleted successfully for file:', fileName);
          resolve();
        })
        .catch(error => {
          console.error('Error during embedding deletion:', error);
          reject(error);
        });
    };

    request.onerror = (error) => {
      console.error('Error getting embeddings to delete:', error);
      reject(error);
    };
  });

  // Then delete from files store
  await new Promise((resolve, reject) => {
    const transaction = db.transaction([FILES_STORE], 'readwrite');
    const store = transaction.objectStore(FILES_STORE);
    const request = store.delete(fileName);

    request.onsuccess = () => {
      console.log('File deleted from files store:', fileName);
      resolve();
    };

    request.onerror = (error) => {
      console.error('Error deleting file from files store:', error);
      reject(error);
    };
  });

  // Verify deletion
  const remainingEmbeddings = await new Promise((resolve, reject) => {
    const transaction = db.transaction([EMBEDDINGS_STORE], 'readonly');
    const store = transaction.objectStore(EMBEDDINGS_STORE);
    const index = store.index('fileName');
    const request = index.getAll(fileName);

    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });

  if (remainingEmbeddings.length > 0) {
    console.error('Warning: Some embeddings were not deleted:', remainingEmbeddings.length);
    throw new Error('Failed to delete all embeddings');
  }

  console.log('File and all its embeddings successfully deleted:', fileName);
}

export async function storeEmbedding(text, vector, fileName) {
  if (!text || !vector || !fileName) {
    console.error('Missing required fields:', { text: !!text, vector: !!vector, fileName });
    throw new Error('Missing required fields for embedding');
  }

  const db = await initDB();
  const tx = db.transaction(EMBEDDINGS_STORE, 'readwrite');
  const store = tx.objectStore(EMBEDDINGS_STORE);

  const embedding = {
    text,
    vector,
    metadata: {
      fileName,
      timestamp: Date.now()
    }
  };

  console.log('Storing embedding:', {
    textPreview: text.substring(0, 50) + '...',
    vectorLength: vector.length,
    fileName
  });

  return new Promise((resolve, reject) => {
    const request = store.add(embedding);
    request.onsuccess = () => {
      console.log('Embedding stored successfully');
      resolve();
    };
    request.onerror = (error) => {
      console.error('Error storing embedding:', error);
      reject(request.error);
    };
  });
}

export async function searchSimilar(queryVector) {
  const db = await initDB();
  const tx = db.transaction(EMBEDDINGS_STORE, 'readonly');
  const store = tx.objectStore(EMBEDDINGS_STORE);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const embeddings = request.result;
      console.log('Retrieved embeddings for search:', embeddings.length);

      const results = embeddings
        .filter(embedding => {
          const isValid = embedding.text && embedding.vector && embedding.metadata?.fileName;
          if (!isValid) {
            console.warn('Embedding missing required fields:', {
              fileName: embedding.metadata?.fileName,
              hasText: !!embedding.text,
              hasVector: !!embedding.vector,
              metadata: embedding.metadata
            });
          }
          return isValid;
        })
        .map(embedding => ({
          text: embedding.text,
          similarity: cosineSimilarity(queryVector, embedding.vector),
          fileName: embedding.metadata.fileName
        }))
        .sort((a, b) => b.similarity - a.similarity);

      console.log('Returning search results:', results.length);
      console.log('First result sample:', results[0] || 'No results');
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
} 