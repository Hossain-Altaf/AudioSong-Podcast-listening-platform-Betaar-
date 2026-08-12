const CACHE_NAME = 'offline-audio-v1';

export const downloadSong = async (song) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.add(song.audioUrl);

  // Track metadata separately in localStorage (cache only stores the file itself)
  const downloaded = getDownloadedSongs();
  const exists = downloaded.find((s) => s._id === song._id);
  if (!exists) {
    downloaded.push(song);
    localStorage.setItem('downloadedSongs', JSON.stringify(downloaded));
  }
};

export const removeDownload = async (song) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.delete(song.audioUrl);

  const downloaded = getDownloadedSongs().filter((s) => s._id !== song._id);
  localStorage.setItem('downloadedSongs', JSON.stringify(downloaded));
};

export const getDownloadedSongs = () => {
  const stored = localStorage.getItem('downloadedSongs');
  return stored ? JSON.parse(stored) : [];
};

export const isDownloaded = (songId) => {
  return getDownloadedSongs().some((s) => s._id === songId);
};