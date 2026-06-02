import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface SelectionTranslateButtonProps {
  selectedText: string;
  onTranslate: () => void;
}

export function SelectionTranslateButton({
  selectedText,
  onTranslate,
}: SelectionTranslateButtonProps) {
  const { currentLanguage } = useLanguage();

  // Only show if text is selected and language is not Spanish
  if (!selectedText || currentLanguage === 'es') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-30 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <Button
        onClick={onTranslate}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg shadow-lg transition-all hover:shadow-xl"
        title={`Translate selected text to ${currentLanguage === 'en' ? 'English' : 'Spanish'}`}
      >
        <Languages className="h-4 w-4" />
        <span className="text-sm font-semibold">Translate Selection</span>
      </Button>
    </div>
  );
}
