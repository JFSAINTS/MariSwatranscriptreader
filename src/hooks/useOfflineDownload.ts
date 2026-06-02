import { useState, useCallback } from 'react';

const DB_NAME = 'PDFViewerDB';
const STORE_NAME = 'pdfs';
const PDF_KEY = 'sample_pdf';

export interface DownloadState {
  isDownloading: boolean;
  progress: number;
  isDownloaded: boolean;
  error: string | null;
}

export function useOfflineDownload() {
  const [state, setState] = useState<DownloadState>(() => {
    const cached = localStorage.getItem('pdf_offline_status');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return { isDownloading: false, progress: 0, isDownloaded: false, error: null };
      }
    }
    return { isDownloading: false, progress: 0, isDownloaded: false, error: null };
  });

  const openDB = useCallback(async (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  }, []);

  const downloadPDF = useCallback(async (pdfUrl: string) => {
    setState(prev => ({ ...prev, isDownloading: true, error: null }));

    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const blob = await response.blob();
      const db = await openDB();

      // Guardar en IndexedDB
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      await new Promise<void>((resolve, reject) => {
        const request = store.put(blob, PDF_KEY);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      setState({
        isDownloading: false,
        progress: 100,
        isDownloaded: true,
        error: null,
      });

      localStorage.setItem('pdf_offline_status', JSON.stringify({
        isDownloading: false,
        progress: 100,
        isDownloaded: true,
        error: null,
      }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setState(prev => ({
        ...prev,
        isDownloading: false,
        error: errorMsg,
      }));
    }
  }, [openDB]);

  const loadOfflinePDF = useCallback(async (): Promise<Blob | null> => {
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      return new Promise((resolve) => {
        const request = store.get(PDF_KEY);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }, [openDB]);

  const clearOfflinePDF = useCallback(async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(PDF_KEY);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      setState({
        isDownloading: false,
        progress: 0,
        isDownloaded: false,
        error: null,
      });

      localStorage.removeItem('pdf_offline_status');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setState(prev => ({ ...prev, error: errorMsg }));
    }
  }, [openDB]);

  return {
    ...state,
    downloadPDF,
    loadOfflinePDF,
    clearOfflinePDF,
  };
}
