import api from './api';

export const getSongs = async () => {
  const res = await api.get('/songs');
  return res.data;
};

export const getSongById = async (id) => {
  const res = await api.get(`/songs/${id}`);
  return res.data;
};

export const uploadSong = async (formData) => {
  const res = await api.post('/songs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};