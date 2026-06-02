# 📦 Release v1.0.6 - Instructions

## Status: Ready for Release ✅

✅ **Code Changes**: All committed and pushed to GitHub  
✅ **Web Build**: Compiled and ready (MariSwa-v1.0.6-web.zip - 13.7 MB)  
✅ **Version Updated**: v1.0.6 across all files  
✅ **Git Tag**: v1.0.6 created and pushed  

---

## 🌐 Web Release

### What's Included
- Compiled Vite production build with all assets
- Service Worker for offline support
- PWA manifest with custom icons
- PDF sample and all dependencies

### How to Upload to GitHub

1. Go to: https://github.com/JFSAINTS/MariSwatranscriptreader/releases
2. Click "Create a new release"
3. Select tag: **v1.0.6**
4. Title: **v1.0.6 - Cosmic Edition**
5. Upload binary: **MariSwa-v1.0.6-web.zip** (13.7 MB)
6. Copy release notes from below
7. Click "Publish release"

### Release Notes Template
```
Release v1.0.6 - Animated starfield background, custom icons, and automatic update checking

## ✨ Features

- **Animated Starfield Background**: Beautiful cosmic-themed PDF reader with twinkling stars and parallax effect
- **Custom App Icons**: Profile-based icons in multiple sizes (192x192, 256x256, 512x512)
- **Splash Screen**: Branded startup screen (2.5 seconds) with Mari Swa logo
- **Automatic Update Checking**: App checks for updates on launch and notifies users
- **PWA Enhancements**: Updated manifest with custom branding and maskable icons

## 📱 Platforms

- **Web**: Full-featured PDF reader with PWA support
- **Android**: Native app with auto-update capability

## 🚀 Key Changes

- Cosmic starfield background animation (150 stars with twinkling effect)
- Custom splash screen on app startup
- Automatic update checking (every 24 hours)
- Enhanced visual branding
- Improved PWA manifest
```

---

## 📱 Android Release

### To Create Android APK

```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
$env:ANDROID_HOME = $env:LOCALAPPDATA + "\Android\Sdk"
cd D:\MariSwaAppZ\android-twa
.\gradlew.bat assembleRelease
# Output: app\build\outputs\apk\release\app-release.apk
```

### To Upload to GitHub

1. In the same release (v1.0.6), click "Edit release"
2. Upload: **app-release.apk** (size varies)
3. Update and save release

---

## ✅ Final Checklist

- [ ] Web ZIP file uploaded to GitHub Release v1.0.6
- [ ] Android APK file uploaded to GitHub Release v1.0.6
- [ ] Release published (not draft)
- [ ] Release notes complete
- [ ] Version shows as 1.0.6 in app update checker

---

**File Location**: D:\MariSwaAppZ\legacy\MariSwa-v1.0.6-web.zip
**Repository**: https://github.com/JFSAINTS/MariSwatranscriptreader
