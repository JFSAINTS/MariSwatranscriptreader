import { useTranslator } from '@/hooks/useTranslator';

export interface TranslatedPage {
  pageNumber: number;
  originalText: string;
  translatedText: string;
  isTranslating: boolean;
}

export class PDFTranslationService {
  private translateText: (text: string, targetLanguage: string) => Promise<string>;

  constructor(translateTextFn: (text: string, targetLanguage: string) => Promise<string>) {
    this.translateText = translateTextFn;
  }

  async translatePageText(
    text: string,
    targetLanguage: string
  ): Promise<string> {
    if (!text || targetLanguage === 'es') {
      return text;
    }

    // Dividir en párrafos para mejor traducción
    const paragraphs = text.split('\n').filter(p => p.trim().length > 0);

    if (paragraphs.length === 0) return text;

    // Traducir cada párrafo
    const translatedParagraphs = await Promise.all(
      paragraphs.map(para => this.translateText(para, targetLanguage))
    );

    return translatedParagraphs.join('\n');
  }

  async translateMultiplePages(
    pages: Array<{ pageNumber: number; text: string }>,
    targetLanguage: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<Array<{ pageNumber: number; translatedText: string }>> {
    const results: Array<{ pageNumber: number; translatedText: string }> = [];

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const translatedText = await this.translatePageText(page.text, targetLanguage);

      results.push({
        pageNumber: page.pageNumber,
        translatedText,
      });

      if (onProgress) {
        onProgress(i + 1, pages.length);
      }
    }

    return results;
  }
}

// Hook para usar el servicio de traducción en componentes
export function usePDFTranslation() {
  const { translateText, currentLanguage } = useTranslator();

  const service = new PDFTranslationService(translateText);

  return {
    service,
    currentLanguage,
    translatePageText: (text: string) => service.translatePageText(text, currentLanguage),
  };
}
