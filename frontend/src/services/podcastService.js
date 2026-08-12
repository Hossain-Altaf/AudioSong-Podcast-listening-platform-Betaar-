import api from './api';

export const getPodcasts = async () => {
  const res = await api.get('/podcasts');
  return res.data;
};

export const getPodcastById = async (id) => {
  const res = await api.get(`/podcasts/${id}`);
  return res.data;
};

export const createPodcast = async (formData) => {
  const res = await api.post('/podcasts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const addEpisode = async (podcastId, formData) => {
  const res = await api.post(`/podcasts/${podcastId}/episodes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};