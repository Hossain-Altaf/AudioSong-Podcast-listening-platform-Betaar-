import { createContext, useState, useRef } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  const playSong = async (song) => {
  if (currentSong?._id === song._id) {
    togglePlay();
    return;
  }
  audioRef.current.pause();

  let audioSrc = song.audioUrl;

  // Check if this song is cached for offline playback
  try {
    const cache = await caches.open('offline-audio-v1');
    const cachedResponse = await cache.match(song.audioUrl);
    if (cachedResponse) {
      const blob = await cachedResponse.blob();
      audioSrc = URL.createObjectURL(blob);
    }
  } catch (err) {
    // Cache API unavailable or error — fall back to normal URL
  }

  audioRef.current = new Audio(audioSrc);
  audioRef.current.play();
  setCurrentSong(song);
  setIsPlaying(true);

  audioRef.current.onended = () => setIsPlaying(false);
};

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <PlayerContext.Provider
      value={{ currentSong, isPlaying, playSong, togglePlay, audioRef }}
    >
      {children}
    </PlayerContext.Provider>
  );
};