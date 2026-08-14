import api from './api';

export const getAudiobooks = async () => {
  const res = await api.get('/audiobooks');
  return res.data;
};

export const getAudiobookById = async (id) => {
  const res = await api.get(`/audiobooks/${id}`);
  return res.data;
};

export const createAudiobook = async (formData) => {
  const res = await api.post('/audiobooks', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const addChapter = async (audiobookId, formData) => {
  const res = await api.post(`/audiobooks/${audiobookId}/chapters`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};