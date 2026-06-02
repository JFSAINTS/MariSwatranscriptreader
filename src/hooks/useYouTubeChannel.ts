import { useState, useCallback } from 'react';

export interface YouTubeVideo {
  title: string;
  videoId: string;
  url: string;
  publishedAt: string;
  publishedDate: Date;
  description: string;
  thumbnail: string;
}

export interface ChannelInfo {
  name: string;
  description: string;
  subscriberCount: string;
  videoCount: string;
}

const YOUTUBE_API_KEY = 'AIzaSyDoKpVJfgsBcC_5DyJve0M3LUnoqTXb8r8';

export function useYouTubeChannel() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChannelVideos = useCallback(async (channelIdentifier: string) => {
    setLoading(true);
    setError(null);
    setVideos([]);

    try {
      // Si es un handle de usuario (empieza con @), usarlo como búsqueda
      let searchQuery = channelIdentifier;
      if (channelIdentifier.startsWith('@')) {
        searchQuery = channelIdentifier.substring(1);
      }

      // Usar búsqueda en YouTube Data API a través de un proxy CORS
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery + ' channel')}&type=channel&key=${YOUTUBE_API_KEY}`;
      
      // Usar un CORS proxy público
      const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(searchUrl)}`;
      
      const searchResponse = await fetch(corsProxyUrl);
      if (!searchResponse.ok) {
        throw new Error('No se pudo encontrar el canal. Intenta con el ID del canal directamente.');
      }

      const searchData = await searchResponse.json();
      
      if (!searchData.items || searchData.items.length === 0) {
        throw new Error('Canal no encontrado');
      }

      const channelId = searchData.items[0].id.channelId;

      // Obtener información del canal
      const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`;
      const corsChannelUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(channelUrl)}`;
      
      const channelResponse = await fetch(corsChannelUrl);
      if (!channelResponse.ok) throw new Error('Error fetching channel');

      const channelData = await channelResponse.json();
      if (!channelData.items || channelData.items.length === 0) {
        throw new Error('Canal no encontrado');
      }

      const channel = channelData.items[0];
      const uploadPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

      setChannelInfo({
        name: channel.snippet.title,
        description: channel.snippet.description,
        subscriberCount: channel.statistics.subscriberCount || 'N/A',
        videoCount: channel.statistics.videoCount || '0',
      });

      // Obtener todos los videos
      const allVideos: YouTubeVideo[] = [];
      let pageToken = '';
      let hasMore = true;

      while (hasMore) {
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadPlaylistId}&maxResults=50&pageToken=${pageToken}&key=${YOUTUBE_API_KEY}`;
        const corsPlaylistUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(playlistUrl)}`;
        
        const playlistResponse = await fetch(corsPlaylistUrl);
        if (!playlistResponse.ok) throw new Error('Error fetching videos');

        const playlistData = await playlistResponse.json();

        if (playlistData.items) {
          playlistData.items.forEach((item: any) => {
            const snippet = item.snippet;
            allVideos.push({
              title: snippet.title,
              videoId: snippet.resourceId.videoId,
              url: `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`,
              publishedAt: snippet.publishedAt,
              publishedDate: new Date(snippet.publishedAt),
              description: snippet.description,
              thumbnail: snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url || '',
            });
          });
        }

        pageToken = playlistData.nextPageToken || '';
        hasMore = !!playlistData.nextPageToken;
      }

      // Ordenar por fecha (antiguo a nuevo)
      allVideos.sort((a, b) => a.publishedDate.getTime() - b.publishedDate.getTime());
      setVideos(allVideos);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Exportar videos como JSON
  const exportAsJSON = useCallback((videos: YouTubeVideo[], filename: string = 'videos.json') => {
    const dataStr = JSON.stringify(videos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  // Exportar videos como CSV
  const exportAsCSV = useCallback((videos: YouTubeVideo[], filename: string = 'videos.csv') => {
    const headers = ['Título', 'URL', 'Video ID', 'Fecha de Publicación', 'Descripción'];
    const rows = videos.map(v => [
      `"${v.title.replace(/"/g, '""')}"`,
      v.url,
      v.videoId,
      v.publishedAt,
      `"${v.description.replace(/"/g, '""').substring(0, 100)}"`,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return {
    videos,
    channelInfo,
    loading,
    error,
    fetchChannelVideos,
    exportAsJSON,
    exportAsCSV,
  };
}
