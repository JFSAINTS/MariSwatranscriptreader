import { useState, useCallback, useEffect } from 'react';

export function useTextSelection() {
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionVisible, setSelectionVisible] = useState(false);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';

      if (text && text.length > 0) {
        setSelectedText(text);
        setSelectionVisible(true);
      }
    };

    const handleMouseDown = () => {
      // Only hide the button when starting a new selection
      setSelectionVisible(false);
    };

    // Use selectionchange event which is more reliable for text selection
    document.addEventListener('selectionchange', handleSelectionChange, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedText('');
    setSelectionVisible(false);
    window.getSelection()?.removeAllRanges();
  }, []);

  return {
    selectedText,
    selectionVisible,
    clearSelection,
  };
}
