import { useState, useEffect } from 'react';
import { X, Loader2, Copy, Check, ChevronDown } from 'lucide-react';
import { usePDFTextExtraction } from '@/hooks/usePDFTextExtraction';

interface TranslationPanelProps {
  pageText: string;
  pageNumber: number;
  isOpen: boolean;
  onClose: () => void;
}

export function TranslationPanel({
  pageText,
  pageNumber,
  isOpen,
  onClose,
}: TranslationPanelProps) {
  const { translatedContent, isTranslating, extractAndTranslateText } = usePDFTextExtraction();
  const [copied, setCopied] = useState(false);
  const [visibleChars, setVisibleChars] = useState(5000); // Mostrar 5000 caracteres inicialmente

  useEffect(() => {
    if (isOpen && pageText) {
      extractAndTranslateText(pageText);
    }
  }, [isOpen, pageNumber, pageText, extractAndTranslateText]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="bg-card rounded-lg shadow-xl border border-primary/20 max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              English Translation
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Page {pageNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          {isTranslating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
              <p className="text-muted-foreground">Translating to English...</p>
            </div>
          ) : translatedContent ? (
            <>
              <div className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">
                {translatedContent.substring(0, visibleChars)}
              </div>
              {translatedContent.length > visibleChars && (
                <button
                  onClick={() => setVisibleChars(prev => prev + 5000)}
                  className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center justify-center gap-2 w-full"
                >
                  <span>Load more content</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No content to translate</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {translatedContent && !isTranslating && (
          <div className="border-t border-primary/10 p-6 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors w-full justify-center"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Text
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
