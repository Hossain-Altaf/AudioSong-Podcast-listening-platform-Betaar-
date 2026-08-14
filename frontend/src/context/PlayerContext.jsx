import { createContext, useState, useRef } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const audioRef = useRef(new Audio());

  const loadAndPlay = async (song) => {
    audioRef.current.pause();

    let audioSrc = song.audioUrl;
    try {
      const cache = await caches.open('offline-audio-v1');
      const cachedResponse = await cache.match(song.audioUrl);
      if (cachedResponse) {
        const blob = await cachedResponse.blob();
        audioSrc = URL.createObjectURL(blob);
      }
    } catch (err) {
      // Cache unavailable — stream normally
    }

    audioRef.current = new Audio(audioSrc);
    audioRef.current.volume = volume;
    audioRef.current.play();
    setCurrentSong(song);
    setIsPlaying(true);

    audioRef.current.onended = () => {
      playNext();
    };
  };

  // songList: array of song-like objects, startIndex: which one to start on
  const playSong = (song, songList = null, startIndex = 0) => {
    if (currentSong?._id === song._id && !songList) {
      togglePlay();
      return;
    }

    if (songList) {
      setQueue(songList);
      setQueueIndex(startIndex);
    } else {
      setQueue([song]);
      setQueueIndex(0);
    }

    loadAndPlay(song);
  };

  const playNext = () => {
    if (queue.length === 0) return;
    const nextIndex = queueIndex + 1;
    if (nextIndex < queue.length) {
      setQueueIndex(nextIndex);
      loadAndPlay(queue[nextIndex]);
    } else {
      setIsPlaying(false);
    }
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    const prevIndex = queueIndex - 1;
    if (prevIndex >= 0) {
      setQueueIndex(prevIndex);
      loadAndPlay(queue[prevIndex]);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stopPlayback = () => {
  audioRef.current.pause();
  audioRef.current.src = '';
  setCurrentSong(null);
  setIsPlaying(false);
  setQueue([]);
  setQueueIndex(0);
};

  const seekTo = (time) => {
    audioRef.current.currentTime = time;
  };

  const setVolume = (v) => {
    audioRef.current.volume = v;
    setVolumeState(v);
  };

  const hasNext = queueIndex < queue.length - 1;
  const hasPrevious = queueIndex > 0;

  return (
    <PlayerContext.Provider
  value={{
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    seekTo,
    volume,
    setVolume,
    audioRef,
    stopPlayback,
  }}
>
      {children}
    </PlayerContext.Provider>
  );
};