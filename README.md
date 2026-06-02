# Mari Swa Transcript Reader

Advanced PDF reader with **automatic English translation** for reading Mari Swa and Taygeta transcripts.

## 📖 About

Mari Swa Transcript Reader is a modern, feature-rich PDF viewer specifically designed for reading and studying transcripts from **Mari Swa** and **Taygeta** - containing wisdom about consciousness, spirituality, and humanity's cosmic heritage.

The application translates entire PDF pages from Spanish to English automatically, allowing readers from around the world to access these important teachings without language barriers.

### Content Attribution

⚠️ **Important**: The original content (texts, transcripts, and teachings) in the PDFs belong to **Mari Swa and Taygeta** and are distributed freely for educational and personal use.

This application is a **reader and translation tool** - it does not create or own the content. We simply provide a modern, accessible way to read and understand these materials.

---

## ✨ Features

### 🌐 Automatic English Translation
- Translate entire PDF pages from Spanish to English with a single click
- **Complete page translation** - no character limits
- Powered by Google Translate (no API key required)
- Smart caching for fast re-access
- Works offline after first load

### 📖 Advanced PDF Reading
- **Full-text search** across entire document
- **Bookmarks with categories** for easy reference
- Bookmark persistence between sessions
- Jump to specific page
- Smooth navigation with keyboard shortcuts

### 🎨 Modern Interface
- **Dark/Light theme** - choose your preference
- **Responsive design** - works on desktop, tablet, and mobile
- **Zoom controls** - scale text for readability
- **Clean, intuitive UI** - minimal learning curve
- **Accessibility focused** - keyboard navigation support

### 🔄 Offline Support
- **Service Worker** caches pages for offline reading
- Continue reading without internet connection
- PWA installable on mobile devices
- Auto-sync when connection is restored

---

## 🚀 Getting Started

### Web Version (Recommended)
**No installation needed!** Simply visit:
```
https://JFSAINTS.github.io/MariSwatranscriptreader/
```

### Android Mobile
1. Download the APK: [maryswa-transcript-reader-v1.0.4.apk](https://github.com/JFSAINTS/MariSwatranscriptreader/releases/tag/v1.0.4-android)
2. Transfer to your Android device (Android 8.0+)
3. Enable "Unknown Sources" in Settings → Security
4. Open the APK file and tap "Install"

### Local Development
```bash
# Clone repository
git clone https://github.com/JFSAINTS/MariSwatranscriptreader.git
cd MariSwatranscriptreader/legacy

# Install dependencies
npm install

# Install translation backend
npm install @vitalets/google-translate-api

# Run development server with translation backend
npm run dev:full

# Open http://localhost:8080 in your browser
```

---

## 📚 How to Use

### Basic Navigation
- **→ arrow key** - Next page
- **← arrow key** - Previous page
- **Ctrl+F** - Search text
- **B** - Toggle bookmark
- **+/-** - Zoom in/out
- **0** - Reset zoom to 100%
- **G** - Go to page dialog

### Using Translation
1. Navigate to any PDF page with Spanish text
2. Click the **"T"** button in the toolbar (top right)
3. Wait for "Translating to English..." message
4. View complete English translation in modal
5. Use "Load more content" if translation exceeds 5000 chars
6. Click "Copy Text" to copy translation

### Bookmarking
1. Click **bookmark icon** to save current page
2. Organize bookmarks by category
3. Access saved bookmarks from sidebar
4. Bookmarks persist between sessions

### Search
1. Press **Ctrl+F** or click search icon
2. Type text to find
3. Navigate through results
4. Search works across entire PDF

---

## 🛠 Technical Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **PDF.js** - PDF rendering

### Backend
- **Node.js** - Translation server
- **Google Translate API** - Translation engine (free tier, no key required)
- **Express** - Server framework (via Vite proxy)

### Mobile
- **Capacitor** - Mobile bridge
- **Android SDK** - Mobile build
- **Gradle** - Build system

### Deployment
- **GitHub Pages** - Web hosting
- **GitHub Releases** - Distribution
- **Service Worker** - Offline support

---

## 📦 Releases

### v1.0.4 - Automatic English Translation
**Release Date:** June 2026

#### What's New
- ✨ Automatic English translation of entire PDF pages
- 🔄 Google Translate integration (no API key needed)
- 📄 Complete page translation support
- 💾 Translation caching system
- 🎯 Per-page translation control

#### Downloads
- **Web**: https://JFSAINTS.github.io/MariSwatranscriptreader/
- **Android APK**: [Download](https://github.com/JFSAINTS/MariSwatranscriptreader/releases/tag/v1.0.4-android)

---

## 📋 System Requirements

### Web Version
- Modern web browser (Chrome, Firefox, Safari, Edge)
- 50MB storage for offline mode
- JavaScript enabled
- Service Worker support

### Android
- **Minimum**: Android 8.0 (API 26)
- **Recommended**: Android 10+
- **Storage**: 50MB free space
- **RAM**: 2GB minimum

---

## 🙏 Credits & Attribution

### Original Content
- **Mari Swa** - Creator and teacher of transcripts
- **Taygeta** - Source of wisdom teachings
- **Content License**: Free distribution for educational and personal use

### Development & Technology
- **Frontend**: TypeScript/React development
- **Translation Backend**: Node.js custom server
- **UI Framework**: Built with Lovable AI Studio
  - **Lovable Platform**: https://lovable.dev
  - Lovable enables rapid AI-assisted web development

### Open Source Libraries
- **PDF.js** - Mozilla Foundation
- **Google Translate API** - Google
- **React** - Meta Platforms
- **Vite** - Evan You
- **Tailwind CSS** - Tailwind Labs
- **TypeScript** - Microsoft

### Application Credits
- **Original Content Creator**: Mari Swa & Taygeta
- **Application Developer**: JFSAINTS
- **AI Development Platform**: Lovable (https://lovable.dev)

---

## 📝 License & Distribution

### Content License
The original transcripts and teachings (Mari Swa and Taygeta content) are provided for **free distribution** for:
- ✅ Personal study and learning
- ✅ Educational purposes
- ✅ Sharing with others (with attribution)
- ✅ Non-commercial use

### Application License
The Mari Swa Transcript Reader application is open source and free to use, modify, and distribute.

### Attribution Required
When sharing content or using this application, please maintain attribution to:
- **Mari Swa** - Original teachings
- **Taygeta** - Source wisdom
- **Mari Swa Transcript Reader** - Reading application

---

## 🐛 Issues & Feedback

Found a bug? Have suggestions? Visit our GitHub:
- **Issues**: https://github.com/JFSAINTS/MariSwatranscriptreader/issues
- **Discussions**: https://github.com/JFSAINTS/MariSwatranscriptreader/discussions

---

## 🔗 Resources

### Tools & Platforms Used
- **Lovable**: https://lovable.dev - AI-assisted development platform
- **GitHub**: https://github.com - Code hosting & releases
- **Google Translate**: Free translation API

### Repository
- **GitHub**: https://github.com/JFSAINTS/MariSwatranscriptreader
- **Web App**: https://JFSAINTS.github.io/MariSwatranscriptreader/

---

## 💡 Tips for Best Experience

1. **Use Dark Theme** at night for comfortable reading
2. **Bookmark Important Passages** for quick reference
3. **Enable Offline Mode** by visiting once online
4. **Use Search** to find specific topics
5. **Translate to English** if reading Spanish transcripts
6. **Adjust Zoom** for your preferred text size

---

## 🌍 Help Us Share

This application makes Mari Swa and Taygeta teachings accessible worldwide. Help spread the knowledge:

- ⭐ Star the GitHub repository
- 🔗 Share the web app link
- 📱 Install the Android app
- 💬 Share feedback and suggestions
- 🙏 Credit the original authors

---

## 🙌 Acknowledgments

Thank you to:
- **Mari Swa and Taygeta** - For sharing transformative wisdom
- **The Open Source Community** - For amazing tools and libraries
- **Lovable AI Studio** - For enabling rapid development
- **All Users** - For supporting accessible education

---

**Mari Swa Transcript Reader** - Making cosmic wisdom accessible to all 🌟

*"The information is freely distributed for the benefit of all humanity."*

---

**Version**: 1.0.4
**Last Updated**: June 2026
**License**: Open Source (Content: Free Distribution)
**Repository**: https://github.com/JFSAINTS/MariSwatranscriptreader
