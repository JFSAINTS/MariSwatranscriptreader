# Mari Swa PDF Reader - Release Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `maryswa-pdf-reader`
3. Description: "Advanced PDF Reader with automatic English translation using Google Translate"
4. Make it **Public**
5. Click "Create repository"

## Step 2: Push Code to GitHub

```bash
cd D:\MariSwaAppZ\legacy

# Change remote URL
git remote set-url origin https://github.com/JFSAINTS/maryswa-pdf-reader.git

# Push to new repository
git push -u origin main
```

## Step 3: Create Web Release (PowerApp)

### Build Web Version

```bash
cd D:\MariSwaAppZ\legacy

# Install dependencies
npm install

# Build for production
npm run build

# Output will be in dist/ folder
```

### Deploy to GitHub Pages

```bash
# Copy dist folder to gh-pages branch
git checkout -b gh-pages
git add dist/ -f
git commit -m "Deploy web version v1.0.4"
git push -u origin gh-pages
```

Then in GitHub settings:
- Go to Settings → Pages
- Source: Deploy from a branch
- Branch: gh-pages
- Save

Your app will be available at: `https://JFSAINTS.github.io/maryswa-pdf-reader/`

### Create Web Release on GitHub

1. Go to https://github.com/JFSAINTS/maryswa-pdf-reader/releases/new
2. Tag version: `v1.0.4-web`
3. Release title: `Web Release v1.0.4 - English Translation`
4. Description:
```
# Mari Swa PDF Reader v1.0.4 - Web Version

## Features
- 📄 Advanced PDF viewing with zoom controls
- 🌐 Automatic English translation of entire PDF pages
- 🔍 Full-text search across PDF
- 📑 Bookmarks with categories
- 🎨 Dark/Light theme support
- ⌨️ Keyboard shortcuts
- 📱 Responsive design

## Access the Web App
Visit: https://JFSAINTS.github.io/maryswa-pdf-reader/

## Installation for Local Development
1. Clone the repository
2. cd legacy
3. npm install
4. npm run dev:full
5. Open http://localhost:8080

## Translation Feature
- Click the "T" button to translate PDF pages from Spanish to English
- Entire pages are translated (no character limits)
- Translations are cached for fast access

## What's New in v1.0.4
- Added automatic English translation with Google Translate
- Translation server backend
- Full page translation support
- Translation caching system
```

5. Click "Publish release"

---

## Step 4: Create Android APK Release

### Prerequisites
```
Java Development Kit (JDK) 21
Android SDK
Gradle
```

### Build APK

```bash
cd D:\CATALOGA\android-twa

# Set environment variables
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"

# Build APK
.\gradlew.bat assembleRelease

# APK location: app\build\outputs\apk\release\app-release.apk
```

### Sign APK (if needed)
```bash
# Create keystore (one time)
keytool -genkey -v -keystore my-release-key.keystore `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -alias my-key-alias

# Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 `
  -keystore my-release-key.keystore `
  app-release.apk my-key-alias
```

### Create APK Release on GitHub

1. Go to https://github.com/JFSAINTS/maryswa-pdf-reader/releases/new
2. Tag version: `v1.0.4-android`
3. Release title: `Android APK v1.0.4`
4. Description:
```
# Mari Swa PDF Reader v1.0.4 - Android APK

## Installation
1. Download the APK file: `maryswa-pdf-reader-v1.0.4.apk`
2. Transfer to your Android device
3. Enable "Unknown Sources" in Settings → Security
4. Install the APK
5. Open the app

## Features
- 📄 Advanced PDF viewing
- 🌐 Automatic English translation
- 📑 Bookmarks and search
- 🎨 Dark/Light theme
- 🔄 Offline support

## Permissions
- Storage: Read PDF files
- Internet: For translation service

## System Requirements
- Android 8.0 (API 26) or higher
- 50MB free storage

## Changelog
- v1.0.4: Added automatic English translation feature
```

5. Upload file: `app-release.apk`
6. Click "Publish release"

---

## Step 5: Create Desktop Release (Windows/Mac/Linux)

### Build Electron Desktop App

```bash
cd D:\MariSwaAppZ\legacy

# Install dependencies
npm install

# Build for Windows
npm run build:win

# Build for Mac (requires macOS)
npm run build:mac

# Build for Linux
npm run build:linux
```

Binaries will be in: `dist/` folder

### Create Desktop Release on GitHub

1. Go to https://github.com/JFSAINTS/maryswa-pdf-reader/releases/new
2. Tag version: `v1.0.4-desktop`
3. Release title: `Desktop Release v1.0.4 (Windows/Mac/Linux)`
4. Upload files:
   - `dist/Collectr-Setup.exe` (Windows installer)
   - `dist/Collectr-Portable.exe` (Windows portable)
   - `dist/Collectr.dmg` (Mac)
   - `dist/collectr.AppImage` (Linux)

---

## Release Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] README.md updated
- [ ] Web version built and deployed to GitHub Pages
- [ ] Web release published (v1.0.4-web)
- [ ] Android APK built and released (v1.0.4-android)
- [ ] Desktop binaries built and released (v1.0.4-desktop)
- [ ] Release notes updated with all features
- [ ] Social media announcement (optional)

---

## Automatic Updates Setup (Optional)

Add version checking to notify users of updates:

1. Update `APP_VERSION` in `src/app.ts` (or `electron-main.js` for desktop)
2. When version changes, users will see notification to download latest release
3. Links point to GitHub Releases page

---

## Support & Feedback

- Issues: https://github.com/JFSAINTS/maryswa-pdf-reader/issues
- Discussions: https://github.com/JFSAINTS/maryswa-pdf-reader/discussions

