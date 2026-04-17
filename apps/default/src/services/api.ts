import axios from 'axios';
import type { Track, Playlist, ApiTrack, ApiPlaylist } from '../types/music';

const api = axios.create({
  baseURL: '/api/taskade',
});

export const musicApi = {
  async getTracks(): Promise<Track[]> {
    const response = await api.get('/projects/Y7bQwu8vVhyoYyD9/nodes');
    const tracks: ApiTrack[] = response.data.payload.nodes;
    
    return tracks.map(track => ({
      id: track.id,
      title: track.fieldValues['/attributes/@trk01'] || track.fieldValues['/text'] || 'Untitled',
      artist: track.fieldValues['/attributes/@art01'] || 'Unknown Artist',
      genre: track.fieldValues['/attributes/@gen01'] || 'unknown',
      duration: track.fieldValues['/attributes/@dur01'] || '0:00',
      audioUrl: track.fieldValues['/attributes/@url01'] || '',
      uploadDate: track.fieldValues['/attributes/@upl01'] || new Date().toISOString(),
      playCount: track.fieldValues['/attributes/@pla01'] || 0,
    }));
  },

  async getPlaylists(): Promise<Playlist[]> {
    const response = await api.get('/projects/EHpUQux3yyQQCphV/nodes');
    const playlists: ApiPlaylist[] = response.data.payload.nodes;
    
    return playlists.map(playlist => ({
      id: playlist.id,
      name: playlist.fieldValues['/attributes/@pln01'] || playlist.fieldValues['/text'] || 'Untitled',
      creator: playlist.fieldValues['/attributes/@crt01'] || 'Unknown',
      trackCount: playlist.fieldValues['/attributes/@trks'] || 0,
      mood: playlist.fieldValues['/attributes/@mod01'] || 'energetic',
      createdDate: playlist.fieldValues['/attributes/@crd01'] || new Date().toISOString(),
    }));
  },

  async uploadTrack(trackData: {
    trackTitle: string;
    artistName: string;
    genre: string;
    duration: string;
    audioFileUrl: string;
  }) {
    return await api.post('/webhooks/01KAW69Q6E7NEV7ZRWNF6RF4FG/run', trackData);
  },

  async incrementPlayCount(trackId: string, currentCount: number) {
    return await api.patch(`/projects/Y7bQwu8vVhyoYyD9/nodes/${trackId}`, {
      '/attributes/@pla01': currentCount + 1,
    });
  },

  async createConversation(agentId: string) {
    const response = await api.post(`/agents/${agentId}/public-conversations`);
    return response.data.conversationId;
  },

  async sendMessage(agentId: string, convoId: string, text: string) {
    return await api.post(`/agents/${agentId}/public-conversations/${convoId}/messages`, { text });
  },
};
