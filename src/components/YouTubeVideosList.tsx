import { useState, useEffect } from 'react';
import { Download, Loader2, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';

interface YouTubeVideo {
  title: string;
  videoId: string;
  url: string;
  publishedAt: string;
  thumbnail: string;
}

interface YouTubeVideosListProps {
  isOpen: boolean;
  onClose: () => void;
  channelHandle?: string;
  channelId?: string;
}

// Channel ID de Swaruu Oficial (obtenido previamente)
const SWARUU_CHANNEL_ID = 'UCJFTzXJZtqc3J7YTc-vqBGQ';

export function YouTubeVideosList({
  isOpen,
  onClose,
  channelHandle = 'SwaruuOficial',
  channelId = SWARUU_CHANNEL_ID
}: YouTubeVideosListProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && videos.length === 0) {
      fetchVideos();
    }
  }, [isOpen, videos.length]);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);

    try {
      // Usar RSS feed de YouTube (sin CORS)
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

      // Usar un proxy CORS confiable
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`;

      const response = await fetch(proxyUrl);

      if (!response.ok) {
        // Fallback: intentar con el RSS directo (algunos navegadores lo permiten)
        const directResponse = await fetch(rssUrl);
        if (!directResponse.ok) {
          throw new Error('No se pudo acceder al canal de YouTube');
        }
      }

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      // Verificar si hay error de parsing
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Error al procesar los datos del canal');
      }

      // Extraer videos del feed
      const entries = xmlDoc.getElementsByTagName('entry');
      const allVideos: YouTubeVideo[] = [];

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        const titleEl = entry.getElementsByTagName('title')[0];
        const idEl = entry.getElementsByTagName('id')[0];
        const publishedEl = entry.getElementsByTagName('published')[0];
        const thumbnailEl = entry.getElementsByTagName('media:thumbnail')[0];

        if (titleEl && idEl) {
          // Extraer video ID del URL
          const idText = idEl.textContent || '';
          const videoIdMatch = idText.match(/video:(\w+)$/);
          const videoId = videoIdMatch ? videoIdMatch[1] : '';

          if (videoId) {
            allVideos.push({
              title: titleEl.textContent || 'Sin título',
              videoId: videoId,
              url: `https://www.youtube.com/watch?v=${videoId}`,
              publishedAt: publishedEl?.textContent || '',
              thumbnail: thumbnailEl?.getAttribute('url') || `https://i.ytimg.com/vi/${videoId}/default.jpg`,
            });
          }
        }
      }

      if (allVideos.length === 0) {
        throw new Error('No se encontraron videos en el canal');
      }

      // Ordenar por fecha (antiguo a nuevo)
      allVideos.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
      setVideos(allVideos);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error:', err);

      // Ofrecer alternativa
      console.log(`Para obtener el listado manual, visita: https://www.youtube.com/@${channelHandle}/videos`);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (videos.length === 0 && error) {
      // Generar PDF con datos hardcodeados si falla la carga
      generatePDFWithHardcodedData();
      return;
    }

    if (videos.length === 0) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    let yPosition = margin;

    // Título
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('Listado de Vídeos', margin, yPosition);

    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Canal Swaruu Oficial - Ordenados por antigüedad', margin, yPosition);

    yPosition += 12;
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);

    yPosition += 8;

    // Contenido
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    videos.forEach((video, idx) => {
      const title = `${idx + 1}. ${video.title}`;
      const url = `URL: ${video.url}`;
      const date = `Fecha: ${new Date(video.publishedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`;

      // Calcular altura necesaria
      const titleLines = pdf.splitTextToSize(title, contentWidth);
      const urlLines = pdf.splitTextToSize(url, contentWidth);

      const titleHeight = titleLines.length * 5;
      const urlHeight = urlLines.length * 5;
      const itemHeight = titleHeight + urlHeight + 10 + 5;

      // Verificar si necesita nueva página
      if (yPosition + itemHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      // Título del video
      pdf.setFont(undefined, 'bold');
      pdf.setFontSize(10);
      pdf.text(titleLines, margin, yPosition);
      yPosition += titleHeight + 3;

      // URL
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 150); // Azul para URLs
      pdf.text(urlLines, margin, yPosition);
      yPosition += urlHeight + 3;

      // Fecha
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.text(date, margin, yPosition);

      yPosition += 10;

      // Separador
      pdf.setLineWidth(0.2);
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
    });

    // Footer
    yPosition += 5;
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    const totalVideos = `Total: ${videos.length} vídeos`;
    pdf.text(totalVideos, margin, pageHeight - margin);
    pdf.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, pageWidth - margin - 50, pageHeight - margin);

    // Descargar
    pdf.save('Listado-Swaruu-Oficial-Videos.pdf');
  };

  const generatePDFWithHardcodedData = () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    let yPosition = margin;

    // Título
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('Listado de Vídeos', margin, yPosition);

    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Canal Swaruu Oficial - Ordenados por antigüedad', margin, yPosition);

    yPosition += 12;
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);

    yPosition += 8;

    // Aviso
    pdf.setFontSize(10);
    pdf.setTextColor(200, 0, 0);
    pdf.setFont(undefined, 'bold');
    const aviso = 'NOTA: No se pudo cargar el listado de YouTube automáticamente.';
    pdf.text(pdf.splitTextToSize(aviso, contentWidth), margin, yPosition);

    yPosition += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(10);

    const instrucciones = [
      'Para obtener el listado de todos los vídeos del canal Swaruu Oficial:',
      '',
      '1. Abre YouTube en tu navegador',
      '2. Visita: https://www.youtube.com/@SwaruuOficial',
      '3. Haz clic en la pestaña "Vídeos"',
      '4. Haz clic en "Ordenar por" (esquina superior derecha)',
      '5. Selecciona "Más antiguos"',
      '6. Ahora puedes ver todos los vídeos ordenados desde el más antiguo',
      '',
      'Cada vídeo muestra su título, URL y fecha de publicación.',
    ];

    instrucciones.forEach((linea) => {
      const lines = pdf.splitTextToSize(linea, contentWidth);
      pdf.text(lines, margin, yPosition);
      yPosition += 5;
    });

    // Footer
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, margin, pageHeight - margin);

    // Descargar
    pdf.save('Listado-Swaruu-Oficial-Videos.pdf');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-card rounded-lg shadow-xl border border-primary/20 max-w-3xl w-full mx-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Listado de Videos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Canal Swaruu Oficial - Ordenados por antigüedad
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">Cargando videos...</p>
              </div>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <p className="text-destructive text-sm mb-3">
                  <strong>⚠️ Error:</strong> {error}
                </p>
                <p className="text-destructive text-xs">
                  Los servidores de YouTube están bloqueando las solicitudes desde el navegador.
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-foreground font-medium mb-4">
                  📄 Descargar Listado Offline
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Descarga un PDF con instrucciones para obtener el listado completo de videos del canal Swaruu Oficial, ordenados por antigüedad.
                </p>
                <Button
                  onClick={generatePDF}
                  className="gap-2 bg-primary hover:bg-primary/90 w-full sm:w-auto"
                >
                  <FileText className="h-4 w-4" />
                  Descargar PDF
                </Button>
              </div>

              <div className="bg-secondary/30 border border-primary/20 rounded-lg p-4">
                <p className="text-foreground font-medium mb-2 text-sm">
                  💡 Cómo obtener el listado manualmente
                </p>
                <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Abre el canal en YouTube: <a href="https://www.youtube.com/@SwaruuOficial" target="_blank" rel="noopener noreferrer" className="text-primary underline">Swaruu Oficial</a></li>
                  <li>Ve a la pestaña "Videos"</li>
                  <li>Haz clic en "Ordenar por" (esquina superior derecha)</li>
                  <li>Selecciona "Más antiguos"</li>
                </ol>
              </div>
            </div>
          ) : videos.length > 0 ? (
            <>
              <div className="mb-4 flex gap-2 flex-wrap">
                <Button
                  onClick={generatePDF}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  <FileText className="h-4 w-4" />
                  Descargar PDF
                </Button>
                <Button
                  onClick={() => {
                    const urls = videos.map(v => v.url).join('\n');
                    navigator.clipboard.writeText(urls);
                    alert('URLs copiadas al portapapeles');
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Copiar URLs
                </Button>
              </div>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {videos.map((video, idx) => (
                  <div
                    key={video.videoId}
                    className="bg-secondary/30 rounded-lg p-3 hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="flex gap-3 items-start">
                      <span className="text-xs font-semibold text-muted-foreground min-w-fit pt-1">
                        {idx + 1}.
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm line-clamp-2">
                          {video.title}
                        </p>
                        <p className="text-xs text-primary break-all hover:underline mt-1">
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary/80"
                          >
                            {video.url}
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </a>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(video.publishedAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-primary/10 text-sm text-muted-foreground">
                <p>
                  <strong>{videos.length}</strong> videos encontrados - Ordenados de antiguo a nuevo
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
