import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { currentLanguage, changeLanguage, translating, languages } = useLanguage();

  const currentLang = languages.find(l => l.code === currentLanguage);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative z-50" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        disabled={translating}
        className="p-2 sm:p-1 h-10 w-10 sm:h-8 sm:w-8 button-hover-accent hover:text-cyan-400"
        aria-label="Cambiar idioma"
        title={`Idioma actual: ${currentLang?.nativeName}`}
      >
        <Languages className="h-4 w-4" />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 bg-card rounded-lg border border-primary/20 shadow-2xl p-2 w-56 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded text-sm transition-colors flex justify-between items-center ${
                  currentLanguage === lang.code
                    ? 'bg-primary/30 text-primary font-semibold'
                    : 'hover:bg-secondary/60 text-foreground'
                }`}
                type="button"
              >
                <span className="font-medium">{lang.nativeName}</span>
                {currentLanguage === lang.code && <span className="text-xs ml-2">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
