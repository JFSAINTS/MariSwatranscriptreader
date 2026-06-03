import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

const translationCache = new Map<string, string>();
// v2: invalida caché corrupta anterior (valores en español sin traducir)
const CACHE_KEY_PREFIX = 'pdf-trans-v2-';

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

      // Google Translate API informal (mismo endpoint que usan las extensiones del navegador)
      // Sin API key, sin registro, funciona directamente desde el browser
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      // El resultado es array anidado: data[0] contiene los fragmentos traducidos
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0]
          .filter((item: any[]) => item && item[0])
          .map((item: any[]) => item[0])
          .join('');

        if (translated && translated.trim().toLowerCase() !== text.trim().toLowerCase()) {
          translationCache.set(cacheKey, translated);
          localStorage.setItem(`${CACHE_KEY_PREFIX}${cacheKey}`, translated);
        }
        return translated || text;
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
