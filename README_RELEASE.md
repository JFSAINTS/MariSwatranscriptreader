# Mari Swa PDF Reader - Release Notes

## Version 1.0.4 - Automatic English Translation

### New Features
- ✨ **Automatic English Translation**: Translate entire PDF pages from Spanish to English with a single click
- 🔄 **Google Translate Integration**: Uses Google Translate for high-quality translations
- 📄 **Full Page Translation**: No character limits - entire pages are translated at once
- 💾 **Translation Caching**: Translations are cached for fast re-access
- 🎯 **Per-Page Translaton**: Each PDF page can be translated independently

### Technical Details
- Added translation server (`translate-server.js`) running on port 3001
- Translation backend uses `@vitalets/google-translate-api` (no official API key needed)
- Vite proxy configuration forwards `/api/translate` requests to backend
- Added `npm run dev:full` script to run both servers simultaneously

### Improvements
- Better PDF text extraction with proper line break detection
- Pagination for large translated content (5000 chars per view)
- Translation fallback to original text on errors
- Improved user feedback during translation

### Files Changed
- `src/context/LanguageContext.tsx` - Translation API client
- `src/hooks/usePDFTextExtraction.ts` - Text extraction and batching
- `src/components/pdf/TranslationPanel.tsx` - UI for translation display
- `translate-server.js` - NEW: Backend translation server
- `vite.config.ts` - Added API proxy configuration
- `package.json` - Added dependencies and npm scripts

### How to Use

1. **Web Version**: Visit the application and navigate to any PDF page with Spanish text
2. Click the "T" button in the toolbar or "Ver traducción" button
3. Wait for translation to complete (displays "Translating to English...")
4. View the complete English translation in the modal
5. Use "Load more content" button if translation exceeds 5000 characters

### Installation & Running

```bash
# Install dependencies
npm install

# Run development with translation server
npm run dev:full

# Build for production
npm run build
```

### Browser Requirements
- Modern browser with Service Worker support
- HTTPS or localhost for full functionality

### Known Limitations
- Google Translate API has rate limits (≈10 requests/second)
- Very large pages (50KB+ text) may take longer to translate
- Translation quality depends on source text quality

### Future Improvements
- [ ] Add language selection (currently English only)
- [ ] Support for other source languages
- [ ] Offline translation option (local model)
- [ ] Translation history and comparison
- [ ] Export translated PDFs

---

**Download**: Available as Web App, Desktop (Windows/Mac/Linux), and Android APK
**Repository**: https://github.com/JFSAINTS/maryswa-pdf-reader
