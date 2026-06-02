import { useState, useEffect, useCallback } from 'react';

export type BookmarkCategory = 'important' | 'review' | 'reference' | 'todo';

const CATEGORY_COLORS: Record<BookmarkCategory, string> = {
  important: '#ef4444',
  review: '#f59e0b',
  reference: '#3b82f6',
  todo: '#10b981',
};

export interface Bookmark {
  id: string;
  page: number;
  title: string;
  category?: BookmarkCategory;
  color?: string;
  snippet?: string;
  createdAt: number;
}

const STORAGE_KEY = 'pdf-reader-bookmarks-v2';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = useCallback((page: number, title?: string, category?: BookmarkCategory, snippet?: string) => {
    const bm: Bookmark = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      page,
      title: title || `Página ${page}`,
      category,
      color: category ? CATEGORY_COLORS[category] : undefined,
      snippet,
      createdAt: Date.now(),
    };
    setBookmarks(prev => [...prev, bm]);
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  const updateBookmark = useCallback((id: string, updates: Partial<Bookmark>) => {
    setBookmarks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const updateBookmarkCategory = useCallback((id: string, category: BookmarkCategory) => {
    setBookmarks(prev => prev.map(b =>
      b.id === id ? { ...b, category, color: CATEGORY_COLORS[category] } : b
    ));
  }, []);

  const isBookmarked = useCallback((page: number) => {
    return bookmarks.some(b => b.page === page);
  }, [bookmarks]);

  const toggleBookmark = useCallback((page: number) => {
    const existing = bookmarks.find(b => b.page === page);
    if (existing) {
      setBookmarks(prev => prev.filter(b => b.id !== existing.id));
    } else {
      addBookmark(page);
    }
  }, [bookmarks, addBookmark]);

  const getBookmarksByCategory = useCallback((category: BookmarkCategory) => {
    return bookmarks.filter(b => b.category === category);
  }, [bookmarks]);

  const searchBookmarks = useCallback((query: string) => {
    const q = query.toLowerCase();
    return bookmarks.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.snippet?.toLowerCase().includes(q)
    );
  }, [bookmarks]);

  const reorderBookmarks = useCallback((newOrder: Bookmark[]) => {
    setBookmarks(newOrder);
  }, []);

  const exportBookmarks = useCallback((): string => {
    return JSON.stringify(bookmarks, null, 2);
  }, [bookmarks]);

  const importBookmarks = useCallback((json: string) => {
    try {
      const imported = JSON.parse(json) as Bookmark[];
      if (Array.isArray(imported)) {
        setBookmarks(imported);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    updateBookmark,
    updateBookmarkCategory,
    isBookmarked,
    toggleBookmark,
    getBookmarksByCategory,
    searchBookmarks,
    reorderBookmarks,
    exportBookmarks,
    importBookmarks,
    CATEGORY_COLORS,
  };
}
