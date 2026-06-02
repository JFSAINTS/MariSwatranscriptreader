import { useState, useCallback, useRef } from 'react';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'en', name: 'English', nativeName: 'English' },
];

// Cache de traducciones para evitar traducir lo mismo múltiples veces
const translationCache = new Map<string, string>();
const CACHE_KEY_PREFIX = 'pdf-translator-cache-';

export function useTranslator() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('es');
  const [translating, setTranslating] = useState(false);
  const cacheLoadedRef = useRef(false);

  // Cargar caché desde localStorage al iniciar
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

  const getCacheKey = useCallback((text: string, language: string): string => {
    return `${language}:${text}`;
  }, []);

  const translateText = useCallback(async (text: string, targetLanguage: string): Promise<string> => {
    if (targetLanguage === 'es' || !text || text.trim().length === 0) return text;

    // Cargar caché si no se ha cargado
    loadCacheFromStorage();

    const cacheKey = getCacheKey(text, targetLanguage);

    // Verificar si está en caché
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    try {
      setTranslating(true);
      // Usar MyMemory API (gratuita, sin API key)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${targetLanguage}`
      );
      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData.translatedText) {
        const translated = data.responseData.translatedText;

        // Guardar en caché de memoria
        translationCache.set(cacheKey, translated);

        // Guardar en localStorage también
        localStorage.setItem(
          `${CACHE_KEY_PREFIX}${cacheKey}`,
          translated
        );

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

  const changeLanguage = useCallback((languageCode: string) => {
    setCurrentLanguage(languageCode);
    // Guardar preferencia en localStorage
    localStorage.setItem('pdf-reader-language', languageCode);
  }, []);

  // Cargar idioma guardado al inicializar
  const loadSavedLanguage = useCallback(() => {
    const saved = localStorage.getItem('pdf-reader-language');
    if (saved && LANGUAGES.some(l => l.code === saved)) {
      setCurrentLanguage(saved);
    }
  }, []);

  // Limpiar caché si es necesario
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

  return {
    currentLanguage,
    translating,
    translateText,
    changeLanguage,
    loadSavedLanguage,
    clearCache,
    languages: LANGUAGES,
  };
}
