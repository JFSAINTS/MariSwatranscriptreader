import { useEffect } from 'react';

export interface KeyboardCallbacks {
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onToggleSearch?: () => void;
  onToggleBookmark?: () => void;
  onOpenGotoDialog?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export function useKeyboardNavigation(callbacks: KeyboardCallbacks) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' && (target as HTMLInputElement).type !== 'number';
      const isTextarea = target.tagName === 'TEXTAREA';

      // Arrow keys for page navigation
      if (e.key === 'ArrowRight' && !isInput && !isTextarea) {
        e.preventDefault();
        callbacks.onNextPage?.();
        return;
      }

      if (e.key === 'ArrowLeft' && !isInput && !isTextarea) {
        e.preventDefault();
        callbacks.onPrevPage?.();
        return;
      }

      // Ctrl+F / Cmd+F for search (prevent default browser search)
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        callbacks.onToggleSearch?.();
        return;
      }

      // B for bookmark toggle
      if (e.key === 'b' && !isInput && !isTextarea && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        callbacks.onToggleBookmark?.();
        return;
      }

      // G for goto page
      if (e.key === 'g' && !isInput && !isTextarea && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        callbacks.onOpenGotoDialog?.();
        return;
      }

      // + or = for zoom in
      if ((e.key === '+' || e.key === '=') && !isInput && !isTextarea && !e.ctrlKey) {
        e.preventDefault();
        callbacks.onZoomIn?.();
        return;
      }

      // - for zoom out
      if (e.key === '-' && !isInput && !isTextarea && !e.ctrlKey) {
        e.preventDefault();
        callbacks.onZoomOut?.();
        return;
      }

      // 0 for reset zoom
      if (e.key === '0' && !isInput && !isTextarea && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        callbacks.onResetZoom?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
}
