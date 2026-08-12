import api from './api';

export const createPlaylist = async (data) => {
  const res = await api.post('/playlists', data);
  return res.data;
};

export const getMyPlaylists = async () => {
  const res = await api.get('/playlists/my');
  return res.data;
};

export const addSongToPlaylist = async (playlistId, songId) => {
  const res = await api.put(`/playlists/${playlistId}/add`, { songId });
  return res.data;
};