import { useState, useCallback } from 'react';

export interface YouTubeVideo {
  videoId: string;
  url: string;
  title?: string;
}

export interface YouTubeLinkState {
  isOpen: boolean;
  video: YouTubeVideo | null;
}

export function useYouTubeDetector() {
  const [state, setState] = useState<YouTubeLinkState>({
    isOpen: false,
    video: null,
  });

  // Detectar si una URL es de YouTube
  const isYouTubeUrl = useCallback((url: string): boolean => {
    if (!url) return false;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];
    return patterns.some(pattern => pattern.test(url));
  }, []);

  // Extraer video ID de una URL de YouTube
  const getVideoId = useCallback((url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  }, []);

  const openYouTubeOptions = useCallback((url: string) => {
    const videoId = getVideoId(url);
    if (videoId) {
      setState({
        isOpen: true,
        video: {
          videoId,
          url,
        },
      });
    }
  }, [getVideoId]);

  const closeYouTubeOptions = useCallback(() => {
    setState({
      isOpen: false,
      video: null,
    });
  }, []);

  // Descargar video usando una API online
  const downloadVideo = useCallback(async (videoUrl: string) => {
    try {
      // Usar una API de descarga online
      // Opciones: yt-dlp API, y2mate, savefrom, etc.
      const apiUrl = `https://www.y2mate.com/en1/download`;

      // Abrir en nueva pestaña el descargador
      window.open(`https://www.y2mate.com/en/youtube/${videoUrl.split('v=')[1] || videoUrl.split('/').pop()}`, '_blank');
    } catch (error) {
      console.error('Error downloading video:', error);
    }
  }, []);

  return {
    state,
    isYouTubeUrl,
    getVideoId,
    openYouTubeOptions,
    closeYouTubeOptions,
    downloadVideo,
  };
}
