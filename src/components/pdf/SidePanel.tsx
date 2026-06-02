import { X, FileText, BookMarked, ChevronRight, ChevronDown, Trash2, Edit2, LayoutGrid, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { OutlineItem } from '@/hooks/usePdfDocument';
import type { Bookmark, BookmarkCategory } from '@/hooks/useBookmarks';

interface Props {
  open: boolean;
  onClose: () => void;
  outline: OutlineItem[];
  bookmarks: Bookmark[];
  onNavigate: (page: number) => void;
  onOutlineClick: (dest: any) => void;
  onRemoveBookmark: (id: string) => void;
  onUpdateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  onUpdateBookmarkCategory?: (id: string, category: BookmarkCategory) => void;
  numPages: number;
  currentPage: number;
  renderPage: (pageNum: number, canvas: HTMLCanvasElement, scale: number) => Promise<any>;
  getPageViewport: (pageNum: number, scale: number) => Promise<any>;
}

type Tab = 'outline' | 'bookmarks' | 'thumbnails';

function OutlineTree({ items, onOutlineClick, depth = 0 }: {
  items: OutlineItem[];
  onOutlineClick: (dest: any) => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set(items.map((_, i) => i)));

  const toggle = (i: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <ul className={depth > 0 ? 'ml-3 border-l border-border/50 pl-2' : ''}>
      {items.map((item, i) => (
        <li key={i}>
          <div className="flex items-center gap-1 py-1.5">
            {item.items?.length > 0 ? (
              <button
                onClick={() => toggle(i)}
                className="h-5 w-5 flex items-center justify-center shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                {expanded.has(i) ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
            ) : (
              <span className="w-5" />
            )}
            <button
              onClick={() => onOutlineClick(item.dest)}
              className="text-sm text-left truncate hover:text-primary transition-colors flex-1"
            >
              {item.title}
            </button>
          </div>
          {item.items?.length > 0 && expanded.has(i) && (
            <OutlineTree items={item.items} onOutlineClick={onOutlineClick} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

function Thumbnail({ pageNum, renderPage, getPageViewport, isActive, onClick }: {
  pageNum: number;
  renderPage: Props['renderPage'];
  getPageViewport: Props['getPageViewport'];
  isActive: boolean;
  onClick: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    rendered.current = true;

    (async () => {
      const vp = await getPageViewport(pageNum, 1);
      if (!vp) return;
      const thumbWidth = 200;
      const scale = thumbWidth / vp.width;
      await renderPage(pageNum, canvas, scale * (window.devicePixelRatio || 1));
      canvas.style.width = `${vp.width * scale}px`;
      canvas.style.height = `${vp.height * scale}px`;
    })();
  }, [pageNum, renderPage, getPageViewport]);

  return (
    <button
      onClick={onClick}
      className={`w-full flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
        isActive ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-secondary/60'
      }`}
    >
      <canvas ref={canvasRef} className="rounded shadow-sm max-w-full" />
      <span className={`text-xs tabular-nums ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
        {pageNum}
      </span>
    </button>
  );
}

const CATEGORY_COLORS: Record<BookmarkCategory, string> = {
  important: '#ef4444',
  review: '#f59e0b',
  reference: '#3b82f6',
  todo: '#10b981',
};

const CATEGORY_LABELS: Record<BookmarkCategory, string> = {
  important: 'Importante',
  review: 'Revisar',
  reference: 'Referencia',
  todo: 'Por hacer',
};

export function SidePanel({
  open, onClose, outline, bookmarks, onNavigate, onOutlineClick, onRemoveBookmark, onUpdateBookmark,
  onUpdateBookmarkCategory,
  numPages, currentPage, renderPage, getPageViewport,
}: Props) {
  const [tab, setTab] = useState<Tab>(outline.length > 0 ? 'outline' : 'thumbnails');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookmarkCategory | 'all'>('all');

  const startEdit = (bm: Bookmark) => {
    setEditingId(bm.id);
    setEditTitle(bm.title);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      onUpdateBookmark(editingId, { title: editTitle.trim() });
    }
    setEditingId(null);
  };

  const filteredBookmarks = bookmarks
    .filter(bm => {
      if (selectedCategory !== 'all' && bm.category !== selectedCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return bm.title.toLowerCase().includes(q) || bm.snippet?.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => a.page - b.page);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-foreground/20 z-30 lg:hidden" onClick={onClose} />
      )}

      <div className={`
        fixed right-0 top-0 bottom-0 w-72 bg-card border-l z-40
        transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : 'translate-x-full'}
        lg:relative lg:z-10
        flex flex-col shadow-xl
      `}>
        <div className="h-14 flex items-center justify-between px-3 border-b shrink-0">
          <div className="flex gap-1">
            <button
              onClick={() => setTab('outline')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                tab === 'outline' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Índice
            </button>
            <button
              onClick={() => setTab('thumbnails')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                tab === 'thumbnails' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Páginas
            </button>
            <button
              onClick={() => setTab('bookmarks')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                tab === 'bookmarks' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <BookMarked className="h-3.5 w-3.5" />
              Marcadores
            </button>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {open && (
          <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
            {tab === 'outline' && (
              outline.length > 0 ? (
                <OutlineTree items={outline} onOutlineClick={onOutlineClick} />
              ) : (
                <p className="text-sm text-muted-foreground text-center mt-8">
                  Este PDF no tiene índice estructurado
                </p>
              )
            )}

            {tab === 'thumbnails' && (
              <div className="grid grid-cols-1 gap-2">
                {Array.from({ length: numPages }, (_, i) => i + 1).map(p => (
                  <Thumbnail
                    key={p}
                    pageNum={p}
                    renderPage={renderPage}
                    getPageViewport={getPageViewport}
                    isActive={p === currentPage}
                    onClick={() => onNavigate(p)}
                  />
                ))}
              </div>
            )}

            {tab === 'bookmarks' && (
              <div className="flex flex-col gap-3 h-full">
                {/* Search bar */}
                <div className="relative flex-shrink-0">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                </div>

                {/* Category filter */}
                <div className="flex gap-1 flex-wrap flex-shrink-0">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    Todas
                  </button>
                  {(Object.keys(CATEGORY_LABELS) as BookmarkCategory[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'text-white'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      style={selectedCategory === cat ? { backgroundColor: CATEGORY_COLORS[cat] } : {}}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>

                {/* Bookmarks list */}
                <div className="flex-1 overflow-y-auto">
                  {filteredBookmarks.length > 0 ? (
                    <ul className="space-y-0.5">
                      {filteredBookmarks.map(bm => (
                        <li key={bm.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/60 group">
                          {bm.category && (
                            <div
                              className="h-3 w-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: bm.color || CATEGORY_COLORS[bm.category] }}
                              title={CATEGORY_LABELS[bm.category]}
                            />
                          )}
                          {editingId === bm.id ? (
                            <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }} className="flex-1">
                              <Input
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                onBlur={saveEdit}
                                className="h-7 text-sm"
                                autoFocus
                              />
                            </form>
                          ) : (
                            <button
                              onClick={() => onNavigate(bm.page)}
                              className="flex-1 text-left text-sm truncate hover:text-primary transition-colors"
                            >
                              <span className="text-primary font-semibold mr-2 text-xs">p.{bm.page}</span>
                              {bm.title}
                            </button>
                          )}
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {bm.category && onUpdateBookmarkCategory && (
                              <select
                                value={bm.category}
                                onChange={e => onUpdateBookmarkCategory(bm.id, e.target.value as BookmarkCategory)}
                                className="h-6 w-6 rounded text-xs opacity-0 group-hover:opacity-100 cursor-pointer"
                                style={{ backgroundColor: CATEGORY_COLORS[bm.category] + '40' }}
                              >
                                {(Object.keys(CATEGORY_LABELS) as BookmarkCategory[]).map(cat => (
                                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                                ))}
                              </select>
                            )}
                            <button onClick={() => startEdit(bm)} className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground rounded">
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button onClick={() => onRemoveBookmark(bm.id)} className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-destructive rounded">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : bookmarks.length > 0 ? (
                    <div className="text-center mt-8">
                      <p className="text-sm text-muted-foreground">
                        No se encontraron marcadores
                      </p>
                    </div>
                  ) : (
                    <div className="text-center mt-8">
                      <BookMarked className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Sin marcadores aún
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Usa el icono de marcador en la barra superior
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
