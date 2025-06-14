# NeuroDB

A modern, privacy-focused document management system that uses semantic search to help you find information in your PDF documents quickly and efficiently.

## Features

- 🔍 **Semantic Search**: Find relevant content using natural language queries
- 📄 **PDF Processing**: Automatic text extraction and smart document chunking
- 🔒 **Privacy First**: All data is stored locally in your browser
- 🚀 **Modern UI**: Clean, intuitive interface with responsive design
- 📱 **Cross-Platform**: Works on desktop and mobile browsers

## Tech Stack

- SvelteKit for the frontend framework
- TailwindCSS for styling
- IndexedDB for local storage
- PDF.js for PDF processing
- Hugging Face Transformers for semantic search

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/neurodb.git
cd neurodb
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Uploading Files

1. Click the "Upload" tab
2. Drag and drop your PDF files or click to select
3. Wait for the processing to complete
4. Your files are now ready for searching

### Searching Documents

1. Click the "Search" tab
2. Enter your search query in natural language
3. View results ranked by relevance
4. Click on results to view full context

## Privacy & Security

- All data is stored locally in your browser's IndexedDB
- No data is sent to external servers
- All processing happens in your browser
- You can delete your data at any time

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.