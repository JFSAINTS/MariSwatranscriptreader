import { useState } from 'react';
import { useYouTubeChannel } from '@/hooks/useYouTubeChannel';
import { Loader2, Download, FileJson, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function YouTubeDownloader() {
  const [channelHandle, setChannelHandle] = useState('@SwaruuOficial');
  const { videos, channelInfo, loading, error, fetchChannelVideos, exportAsJSON, exportAsCSV } = useYouTubeChannel();

  const handleFetch = async () => {
    if (channelHandle.trim()) {
      await fetchChannelVideos(channelHandle);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Descargador de Videos de YouTube
          </h1>
          <p className="text-muted-foreground">
            Obtén un listado de todos los videos de un canal, ordenados por fecha de publicación
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-card rounded-lg border border-primary/20 p-6 mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            Canal de YouTube (formato: @usuario o ID del canal)
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={channelHandle}
              onChange={(e) => setChannelHandle(e.target.value)}
              placeholder="@SwaruuOficial o UCxxx..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleFetch();
              }}
            />
            <Button
              onClick={handleFetch}
              disabled={loading || !channelHandle.trim()}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Obtener Videos
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
            <p className="text-destructive text-sm mb-3">
              <strong>Error:</strong> {error}
            </p>
            <p className="text-destructive text-xs mb-2">
              <strong>Alternativa:</strong> Puedes obtener el listado manualmente usando estos servicios:
            </p>
            <ul className="text-destructive text-xs space-y-1 list-disc list-inside">
              <li>
                <a href="https://www.tubebuddy.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-destructive/80">
                  TubeBuddy - Estadísticas de YouTube
                </a>
              </li>
              <li>
                <a href="https://www.channelcrawler.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-destructive/80">
                  Channel Crawler - Búsqueda de canales
                </a>
              </li>
              <li>
                Accede directamente al canal en YouTube y ordena videos por fecha
              </li>
            </ul>
          </div>
        )}

        {/* Channel Info */}
        {channelInfo && (
          <div className="bg-card rounded-lg border border-primary/20 p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">{channelInfo.name}</h2>
            <p className="text-muted-foreground mb-4">{channelInfo.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Videos:</span>
                <p className="text-lg font-semibold text-foreground">{channelInfo.videoCount}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Suscriptores:</span>
                <p className="text-lg font-semibold text-foreground">{channelInfo.subscriberCount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Export Buttons */}
        {videos.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant="outline"
              onClick={() => exportAsJSON(videos, `${channelHandle}-videos.json`)}
              className="gap-2"
            >
              <FileJson className="h-4 w-4" />
              Descargar JSON
            </Button>
            <Button
              variant="outline"
              onClick={() => exportAsCSV(videos, `${channelHandle}-videos.csv`)}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Descargar CSV
            </Button>
          </div>
        )}

        {/* Videos List */}
        {videos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {videos.length} Video{videos.length !== 1 ? 's' : ''} (ordenado por antigüedad)
              </h3>
            </div>

            <div className="bg-card rounded-lg border border-primary/20 overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 border-b border-primary/20">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Título</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Fecha de Publicación</th>
                      <th className="text-center px-4 py-3 font-semibold text-foreground w-12">Enlace</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video, idx) => (
                      <tr
                        key={video.videoId}
                        className="border-b border-primary/10 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-3">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-12 h-9 rounded object-cover flex-shrink-0"
                            />
                            <div>
                              <p className="font-medium text-foreground line-clamp-2">{video.title}</p>
                              <p className="text-xs text-muted-foreground">{video.videoId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(video.publishedDate)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-1 hover:bg-primary/20 rounded transition-colors"
                            title="Ver en YouTube"
                          >
                            <ExternalLink className="h-4 w-4 text-primary" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-2 p-4">
                {videos.map((video) => (
                  <div
                    key={video.videoId}
                    className="bg-secondary/30 rounded-lg p-3 border border-primary/10"
                  >
                    <div className="flex gap-3 mb-2">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-16 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm line-clamp-2">
                          {video.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(video.publishedDate)}
                        </p>
                      </div>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-primary/20 rounded transition-colors"
                        title="Ver en YouTube"
                      >
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{video.videoId}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Ingresa un canal de YouTube y haz clic en "Obtener Videos" para comenzar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
