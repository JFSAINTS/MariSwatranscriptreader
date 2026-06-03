import {
  ChevronLeft, ChevronRight, Search, Bookmark, BookmarkCheck,
  Menu, ZoomIn, ZoomOut, Moon, Sun, Download, Youtube, Send, Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useOfflineDownload } from '@/hooks/useOfflineDownload';
import { useLanguage } from '@/context/LanguageContext';

// Social media URLs
const YOUTUBE_CHANNEL = 'https://www.youtube.com/@SwaruuOficial';
const TELEGRAM_GROUP = 'https://t.me/+NsX6Bw2dW6o2M2U0';
const WEBSITE = 'https://mariswa.co/';

interface Props {
  currentPage: number;
  numPages: number;
  onPageChange: (page: number) => void;
  onToggleSidebar: () => void;
  onToggleSearch: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleTranslation?: () => void;
}

export function ViewerToolbar({
  currentPage, numPages, onPageChange, onToggleSidebar, onToggleSearch,
  isBookmarked, onToggleBookmark, zoom, onZoomChange, isDark, onToggleTheme, onToggleTranslation,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [pageInput, setPageInput] = useState('');
  const { isDownloading, isDownloaded, downloadPDF, progress } = useOfflineDownload();
  const { translating } = useLanguage();

  const handlePageSubmit = () => {
    const num = parseInt(pageInput);
    if (num >= 1 && num <= numPages) onPageChange(num);
    setEditing(false);
    setPageInput('');
  };

  const handleDownloadOffline = async () => {
    if (confirm('¿Descargar PDF para acceso offline? (~445MB)')) {
      await downloadPDF('/sample.pdf');
    }
  };

  return (
    <header className="h-14 sm:h-14 flex items-center px-2 sm:px-3 gap-0.5 sm:gap-1 border-b toolbar-gradient backdrop-blur-sm shrink-0 z-20 shadow-md smooth-transition">

      {/* Left group: Menu + Social links */}
      <div className="flex items-center gap-0.5 shrink-0">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="shrink-0 p-2 sm:p-1 h-10 w-10 sm:h-8 sm:w-8">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="separator-accent hidden sm:block" />

        {/* YouTube */}
        <a
          href={YOUTUBE_CHANNEL}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 sm:p-1 h-10 w-10 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg button-hover-accent hover:text-red-500"
          aria-label="Canal de YouTube"
          title="Visitar canal de YouTube"
        >
          <Youtube className="h-4 w-4" />
        </a>

        {/* Telegram */}
        <a
          href={TELEGRAM_GROUP}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 sm:p-1 h-10 w-10 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg button-hover-accent hover:text-blue-500"
          aria-label="Grupo de Telegram"
          title="Unirse al grupo de Telegram (Mari Swa Chat)"
        >
          <Send className="h-4 w-4" />
        </a>

        {/* Website */}
        <a
          href={WEBSITE}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 sm:p-1 h-10 w-10 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg button-hover-accent hover:text-amber-500"
          aria-label="Mari Swa Transcripts"
          title="Ir a Mari Swa Transcripts"
        >
          <Globe className="h-4 w-4" />
        </a>
      </div>

      {/* Navigation (center) */}
      <div className="flex items-center gap-0.5 mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 sm:p-1 h-10 w-10 sm:h-8 sm:w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {editing ? (
          <form onSubmit={(e) => { e.preventDefault(); handlePageSubmit(); }}>
            <Input
              type="number"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={handlePageSubmit}
              className="w-16 sm:w-14 h-9 sm:h-7 text-center text-sm p-0"
              min={1}
              max={numPages}
              autoFocus
            />
          </form>
        ) : (
          <button
            onClick={() => { setEditing(true); setPageInput(String(currentPage)); }}
            className="text-sm font-medium tabular-nums min-w-[64px] sm:min-w-[56px] text-center hover:bg-secondary rounded px-2 sm:px-1.5 py-1.5 sm:py-1 transition-colors"
            aria-label={`Página ${currentPage} de ${numPages}`}
          >
            {currentPage} / {numPages}
          </button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= numPages}
          className="p-2 sm:p-1 h-10 w-10 sm:h-8 sm:w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions (right) */}
      <div className="flex items-center gap-0.5 shrink-0 overflow-x-auto">
        {/* Separator */}
        <div className="separator-accent hidden sm:block" />

        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSearch}
          className="p-2 sm:p-1 h-10 w-10 sm:h-8 sm:w-8 button-hover-accent"
          aria-label="Buscar en documento"
          title="Buscar (Ctrl+F)"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Bookmark */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleBookmark}
          className="p-2 sm:p-1 h-10 w-10 sm:h-8 sm:w-8 button-hover-accent"
          aria-label={isBookmarked ? 'Quitar marcador' : 'Agregar marcador'}
          title="Marcador (B)"
        >
          {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
        </Button>

        {/* Separator */}
        <div className="separator-accent hidden sm:block" />

        {/* Zoom (desktop only) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
          className="p-2 sm:p-1 h-10 w-10 sm:h-8 sm:w-8 hidden sm:flex button-hover-accent"
          aria-label="Reducir zoom"
          title="Reducir zoom"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <span className="text-xs tabular-nums w-10 sm:w-9 text-center hidden sm:block text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onZoomChange(Math.min(4, zoom + 0.25))}
          className="p-2 sm:p-1 h-10 w-10 sm:h-8 sm:w-8 hidden sm:flex button-hover-accent"
          aria-label="Ampliar zoom"
          title="Ampliar zoom"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        {/* Separator */}
        <div className="separator-accent hidden sm:block" />

        {/* Translation Button */}
        {onToggleTranslation && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTranslation}
            disabled={translating}
            className="p-2 sm:p-1 h-10 w-10 sm:h-8 sm:w-8 button-hover-accent hover:text-green-400"
            aria-label="Ver traducción"
            title="Ver página traducida al inglés"
          >
            <span className="text-xs font-bold">T</span>
          </Button>
        )}

        {/* Separator */}
        <div className="separator-accent hidden sm:block" />

        {/* Theme */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          className="p-2 sm:p-1 h-10 w-10 sm:h-8 sm:w-8 button-hover-accent"
          aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          title={isDark ? 'Tema claro' : 'Tema oscuro'}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
