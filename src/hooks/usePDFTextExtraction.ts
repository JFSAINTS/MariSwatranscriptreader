import { useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function usePDFTextExtraction() {
  const { translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);

  const extractAndTranslateText = useCallback(
    async (text: string) => {
      if (!text) {
        setTranslatedContent('');
        return;
      }

      setIsTranslating(true);
      try {
        // Dividir el texto en párrafos (ya están separados por \n\n de usePDFPageText)
        // Sin límite - traducir TODA la página
        const paragraphs = text
          .split('\n\n')
          .filter(p => p.trim().length > 0);

        // Traducir todos los párrafos en paralelo (agrupados de a 5 para no sobrecargar)
        const translatedParagraphs = [];
        for (let i = 0; i < paragraphs.length; i += 5) {
          const batch = paragraphs.slice(i, i + 5);
          const batchTranslations = await Promise.all(
            batch.map(para => translateText(para))
          );
          translatedParagraphs.push(...batchTranslations);
        }

        // Reconstruir con espacios dobles entre párrafos (mantener estructura)
        setTranslatedContent(translatedParagraphs.join('\n\n'));
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedContent('');
      } finally {
        setIsTranslating(false);
      }
    },
    [translateText]
  );

  return {
    translatedContent,
    isTranslating,
    extractAndTranslateText,
  };
}
