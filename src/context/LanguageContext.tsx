import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

const translationCache = new Map<string, string>();
const CACHE_KEY_PREFIX = 'pdf-translator-cache-';

interface LanguageContextType {
  currentLanguage: string;
  translating: boolean;
  translateText: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [translating, setTranslating] = useState(false);
  const cacheLoadedRef = useRef(false);

  const loadCacheFromStorage = useCallback(() => {
    if (cacheLoadedRef.current) return;

    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        const cacheKey = key.substring(CACHE_KEY_PREFIX.length);
        const value = localStorage.getItem(key);
        if (value) {
          translationCache.set(cacheKey, value);
        }
      }
    });
    cacheLoadedRef.current = true;
  }, []);

  const getCacheKey = useCallback((text: string): string => {
    return `en:${text}`;
  }, []);

  const translateText = useCallback(async (text: string): Promise<string> => {
    if (!text || text.trim().length === 0) return text;

    loadCacheFromStorage();

    const cacheKey = getCacheKey(text);

    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    try {
      setTranslating(true);

      // MyMemory API — gratuita, sin API key, funciona directo desde el navegador
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        const translated = data.responseData.translatedText;
        translationCache.set(cacheKey, translated);
        localStorage.setItem(`${CACHE_KEY_PREFIX}${cacheKey}`, translated);
        return translated;
      }

      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setTranslating(false);
    }
  }, [loadCacheFromStorage, getCacheKey]);

  const clearCache = useCallback(() => {
    translationCache.clear();
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    cacheLoadedRef.current = false;
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage: 'en',
        translating,
        translateText,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
