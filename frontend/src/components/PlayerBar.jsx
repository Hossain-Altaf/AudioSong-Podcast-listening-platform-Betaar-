import { useContext, useEffect, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';

const PlayerBar = () => {
  const { currentSong, isPlaying, togglePlay, audioRef } = useContext(PlayerContext);
  const [progress, setProgress] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, [currentSong, audioRef]);

  useEffect(() => {
    setShowLyrics(false);
  }, [currentSong]);

  if (!currentSong) return null;

  return (
    <>
      {showLyrics && (
        <div
          style={{
            position: 'fixed',
            bottom: '82px',
            left: 0,
            right: 0,
            maxHeight: '40vh',
            overflowY: 'auto',
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            padding: '1.5rem 2rem',
          }}
        >
          <h3 style={{ marginBottom: '0.75rem' }}>{currentSong.title}</h3>
          <p style={{ whiteSpace: 'pre-line', lineHeight: '1.8', color: 'var(--text-muted)' }}>
            {currentSong.lyrics || 'No lyrics available for this song.'}
          </p>
        </div>
      )}

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          padding: '0.9rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <img
          src={currentSong.coverImage || 'https://via.placeholder.com/50'}
          alt={currentSong.title}
          style={{ width: '46px', height: '46px', borderRadius: 'var(--radius)', objectFit: 'cover' }}
        />

        <div style={{ minWidth: '160px' }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{currentSong.title}</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {currentSong.artist?.name}
          </p>
        </div>

        <button
          onClick={togglePlay}
          style={{
            background: 'var(--accent)',
            color: '#121212',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
          }}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <button onClick={() => setShowLyrics(!showLyrics)} style={{ fontSize: '0.8rem' }}>
          {showLyrics ? 'Hide Lyrics' : 'Lyrics'}
        </button>

        <div
          style={{
            flex: 1,
            background: 'var(--border)',
            height: '3px',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              background: 'var(--accent)',
              height: '100%',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default PlayerBar;