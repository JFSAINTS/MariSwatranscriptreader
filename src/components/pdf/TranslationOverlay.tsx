import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { usePDFTranslation } from '@/services/pdfTranslationService';

interface TranslationOverlayProps {
  pageText: string;
  pageNumber: number;
  isVisible: boolean;
}

export function TranslationOverlay({
  pageText,
  pageNumber,
  isVisible,
}: TranslationOverlayProps) {
  const { translatePageText, currentLanguage } = usePDFTranslation();
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!isVisible || currentLanguage === 'es') {
      setTranslatedText('');
      return;
    }

    const translate = async () => {
      setIsTranslating(true);
      const result = await translatePageText(pageText);
      setTranslatedText(result);
      setIsTranslating(false);
    };

    translate();
  }, [pageText, currentLanguage, pageNumber, isVisible, translatePageText]);

  if (!isVisible || currentLanguage === 'es' || !translatedText) {
    return null;
  }

  if (isTranslating) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded">
        <div className="flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Traduciendo...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-white/95 rounded p-4 overflow-y-auto">
      <div className="text-sm text-foreground whitespace-pre-wrap break-words">
        {translatedText}
      </div>
    </div>
  );
}
