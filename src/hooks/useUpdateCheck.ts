import { useState, useEffect } from 'react';

export interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  downloadUrl: string;
  releaseNotes: string;
}

const APP_VERSION = '1.0.6';
const GITHUB_REPO = 'JFSAINTS/MariSwatranscriptreader';
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas
const LAST_CHECK_KEY = 'lastUpdateCheck';

export function useUpdateCheck() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkForUpdates = async () => {
    try {
      setIsChecking(true);

      // Intenta obtener la información de versión desde GitHub
      // Primero intenta desde el archivo version.json en el repo
      let latestVersion = '';
      let releaseNotes = '';
      let downloadUrl = '';

      try {
        // Intenta cargar version.json desde el repositorio
        const versionResponse = await fetch(
          `https://raw.githubusercontent.com/${GITHUB_REPO}/main/version.json`
        );

        if (versionResponse.ok) {
          const versionData = await versionResponse.json();
          latestVersion = versionData.version || '';
          releaseNotes = versionData.notes || 'Nueva versión disponible';
          downloadUrl = versionData.downloadUrl || `https://github.com/${GITHUB_REPO}/releases`;
        }
      } catch (e) {
        console.warn('Could not fetch version.json, trying GitHub API...');
      }

      // Si no pudo obtener desde version.json, intenta la API de GitHub
      if (!latestVersion) {
        const apiResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
          {
            headers: {
              'Accept': 'application/vnd.github+json',
            },
          }
        );

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          latestVersion = data.tag_name?.replace(/^v/, '') || '';
          releaseNotes = data.body || 'Nueva versión disponible';

          if (navigator.userAgent.includes('Android')) {
            const apkAsset = data.assets?.find((asset: any) =>
              asset.name.endsWith('.apk')
            );
            downloadUrl = apkAsset?.browser_download_url || data.html_url;
          } else {
            downloadUrl = data.html_url;
          }
        } else {
          console.warn(`GitHub API returned ${apiResponse.status}`);
        }
      }

      // Si no hay versión, no continúa
      if (!latestVersion) {
        console.log('Could not determine latest version');
        localStorage.setItem(LAST_CHECK_KEY, Date.now().toString());
        return;
      }

      // Comparar versiones
      if (isNewerVersion(latestVersion, APP_VERSION)) {
        if (!downloadUrl) {
          downloadUrl = `https://github.com/${GITHUB_REPO}/releases`;
        }

        setUpdateInfo({
          hasUpdate: true,
          currentVersion: APP_VERSION,
          latestVersion,
          downloadUrl,
          releaseNotes,
        });

        console.log(`Update available: ${APP_VERSION} → ${latestVersion}`);
      } else {
        console.log(`App is up to date: ${APP_VERSION}`);
      }

      localStorage.setItem(LAST_CHECK_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error checking for updates:', error);
      localStorage.setItem(LAST_CHECK_KEY, Date.now().toString());
    } finally {
      setIsChecking(false);
    }
  };

  const isNewerVersion = (latest: string, current: string): boolean => {
    try {
      const latestParts = latest.split('.').map(Number);
      const currentParts = current.split('.').map(Number);

      for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
        const latestPart = latestParts[i] || 0;
        const currentPart = currentParts[i] || 0;

        if (latestPart > currentPart) return true;
        if (latestPart < currentPart) return false;
      }

      return false;
    } catch (e) {
      console.error('Error comparing versions:', e);
      return false;
    }
  };

  const shouldCheck = () => {
    const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
    if (!lastCheck) return true;

    const timeSinceLastCheck = Date.now() - parseInt(lastCheck);
    return timeSinceLastCheck > CHECK_INTERVAL;
  };

  const downloadAndInstall = () => {
    if (updateInfo?.downloadUrl) {
      window.open(updateInfo.downloadUrl, '_blank');
    }
  };

  useEffect(() => {
    console.log('[UpdateCheck] Starting update check...');
    if (shouldCheck()) {
      console.log('[UpdateCheck] Checking for updates...');
      checkForUpdates();
    } else {
      console.log('[UpdateCheck] Skipping check - checked within last 24 hours');
    }
  }, []);

  return {
    updateInfo,
    isChecking,
    downloadAndInstall,
  };
}
