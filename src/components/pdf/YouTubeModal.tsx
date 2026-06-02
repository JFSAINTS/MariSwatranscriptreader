import { Download, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YouTubeModalProps {
  isOpen: boolean;
  videoUrl: string;
  videoId: string;
  onClose: () => void;
  onDownload: (url: string) => void;
}

export function YouTubeModal({
  isOpen,
  videoUrl,
  videoId,
  onClose,
  onDownload,
}: YouTubeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-primary/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Video de YouTube</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Preview */}
        <div className="mb-4 rounded-lg overflow-hidden bg-black/30">
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="Video thumbnail"
            className="w-full h-auto"
            onError={(e) => {
              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            }}
          />
        </div>

        {/* URL Display */}
        <div className="mb-4 p-3 bg-secondary/50 rounded text-sm text-muted-foreground break-all font-mono">
          {videoUrl}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2 hover:text-primary"
            onClick={() => {
              window.open(videoUrl, '_blank', 'noopener,noreferrer');
              onClose();
            }}
          >
            <ExternalLink className="h-4 w-4" />
            Ver Video
          </Button>
          <Button
            className="flex-1 gap-2 bg-red-600 hover:bg-red-700"
            onClick={() => {
              onDownload(videoUrl);
              onClose();
            }}
          >
            <Download className="h-4 w-4" />
            Descargar
          </Button>
        </div>

        {/* Info Text */}
        <p className="text-xs text-muted-foreground mt-4 text-center">
          La descarga se abrirá en una nueva ventana
        </p>
      </div>
    </div>
  );
}
