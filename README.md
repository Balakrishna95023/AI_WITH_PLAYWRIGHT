This repository extracts UI elements from page.html, creates a semantic search index with Ollama embeddings and Chroma, and maps natural-language queries to locators.

Usage:
- npm install
- npm run extract-elements
- npm run store-elements
- npm run search-locator -- "Find the password button"
- npm run build-index
- npm run run-locator-flow -- "Find the password button"
