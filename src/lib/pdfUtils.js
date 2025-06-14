import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Initialize PDF.js worker only in browser environment
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

/**
 * Extract text from a PDF file
 * @param {File} file - The PDF file to extract text from
 * @returns {Promise<string>} The extracted text
 */
export async function extractTextFromPDF(file) {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Get metadata from a PDF file
 * @param {File} file - The PDF file to get metadata from
 * @returns {Promise<Object>} The PDF metadata
 */
export async function getPDFMetadata(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const metadata = await pdf.getMetadata();
    
    return {
      title: metadata?.info?.Title || file.name,
      author: metadata?.info?.Author || 'Unknown',
      pageCount: pdf.numPages,
      fileSize: file.size,
      lastModified: file.lastModified
    };
  } catch (error) {
    console.error('Error getting PDF metadata:', error);
    throw new Error('Failed to get PDF metadata');
  }
} 