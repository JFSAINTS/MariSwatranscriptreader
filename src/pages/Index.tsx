import { useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { usePdfDocument } from '@/hooks/usePdfDocument';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { usePDFPageText } from '@/hooks/usePDFPageText';
import { PdfCanvas } from '@/components/pdf/PdfCanvas';
import { ViewerToolbar } from '@/components/pdf/ViewerToolbar';
import { SidePanel } from '@/components/pdf/SidePanel';
import { SearchOverlay } from '@/components/pdf/SearchOverlay';
import { TranslationPanel } from '@/components/pdf/TranslationPanel';
import { Loader2, FileWarning } from 'lucide-react';

const PDF_URL = '/sample.pdf';

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [translationOpen, setTranslationOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Extraer texto de la página actual
  const { pageText } = usePDFPageText({
    pdfUrl: PDF_URL,
    pageNumber: currentPage,
  });

  const {
    numPages, loading, error, outline,
    renderPage, searchAllPages, resolveDestination, getPageViewport, getPageAnnotations,
  } = usePdfDocument(PDF_URL);

  const {
    bookmarks, removeBookmark, updateBookmark, updateBookmarkCategory, isBookmarked, toggleBookmark,
  } = useBookmarks();

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= numPages) setCurrentPage(page);
  }, [numPages]);

  const handleOutlineClick = useCallback(async (dest: any) => {
    const page = await resolveDestination(dest);
    if (page) {
      setCurrentPage(page);
      setSidebarOpen(false);
    }
  }, [resolveDestination]);

  const handleSearchNavigate = useCallback((page: number) => {
    setCurrentPage(page);
    setSearchOpen(false);
  }, []);

  useKeyboardNavigation({
    onNextPage: () => handlePageChange(currentPage + 1),
    onPrevPage: () => handlePageChange(currentPage - 1),
    onToggleSearch: () => setSearchOpen(prev => !prev),
    onToggleBookmark: () => toggleBookmark(currentPage),
    onOpenGotoDialog: () => {}, // Optional: could implement a goto dialog
    onZoomIn: () => setZoom(prev => Math.min(4, prev + 0.1)),
    onZoomOut: () => setZoom(prev => Math.max(0.5, prev - 0.1)),
    onResetZoom: () => setZoom(1),
  });

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      <ViewerToolbar
        currentPage={currentPage}
        numPages={numPages}
        onPageChange={handlePageChange}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        onToggleSearch={() => setSearchOpen(prev => !prev)}
        isBookmarked={isBookmarked(currentPage)}
        onToggleBookmark={() => toggleBookmark(currentPage)}
        zoom={zoom}
        onZoomChange={setZoom}
        isDark={theme === 'dark'}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onToggleTranslation={() => setTranslationOpen(prev => !prev)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex items-center justify-center bg-muted/30">
            <div className="w-full max-w-[600px] mx-auto flex flex-col items-center gap-4 px-4">
              <div className="w-full aspect-[1/1.414] bg-card rounded shadow-xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Cargando documento...</p>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileWarning className="h-10 w-10 text-destructive mx-auto mb-3" />
              <p className="text-destructive font-medium">{error}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Verifica que el archivo PDF existe en /public/sample.pdf
              </p>
            </div>
          </div>
        ) : (
          <>
            <SidePanel
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              outline={outline}
              bookmarks={bookmarks}
              onNavigate={(page) => { setCurrentPage(page); setSidebarOpen(false); }}
              onOutlineClick={handleOutlineClick}
              onRemoveBookmark={removeBookmark}
              onUpdateBookmark={updateBookmark}
              onUpdateBookmarkCategory={updateBookmarkCategory}
              numPages={numPages}
              currentPage={currentPage}
              renderPage={renderPage}
              getPageViewport={getPageViewport}
            />

            <PdfCanvas
              renderPage={renderPage}
              getPageViewport={getPageViewport}
              getPageAnnotations={getPageAnnotations}
              pageNumber={currentPage}
              zoom={zoom}
              onZoomChange={setZoom}
              onSwipeLeft={() => handlePageChange(currentPage + 1)}
              onSwipeRight={() => handlePageChange(currentPage - 1)}
            />

            <SearchOverlay
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
              onSearch={searchAllPages}
              onNavigate={handleSearchNavigate}
            />

            <TranslationPanel
              pageText={pageText}
              pageNumber={currentPage}
              isOpen={translationOpen}
              onClose={() => setTranslationOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
