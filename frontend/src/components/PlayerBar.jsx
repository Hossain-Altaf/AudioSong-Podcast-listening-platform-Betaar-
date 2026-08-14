import { useContext, useEffect, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const PlayerBar = () => {
  const {
    currentSong,
    isPlaying,
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
  } = useContext(PlayerContext);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [currentSong, audioRef]);

  useEffect(() => {
    setShowLyrics(false);
  }, [currentSong]);

  const handleSeekClick = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickPercent = (e.clientX - rect.left) / rect.width;
    seekTo(clickPercent * duration);
  };

  if (!currentSong) return null;

  return (
    <>
      {expanded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <button
            onClick={() => setExpanded(false)}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
          >
            ✕ Close
          </button>

          <img
            src={currentSong.coverImage || 'https://via.placeholder.com/300'}
            alt={currentSong.title}
            style={{
              width: '280px',
              height: '280px',
              objectFit: 'cover',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          />

          <h2 style={{ marginBottom: '0.3rem' }}>{currentSong.title}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {currentSong.artist?.name}
          </p>

          <div
            onClick={handleSeekClick}
            style={{
              width: '100%',
              maxWidth: '400px',
              background: 'var(--border)',
              height: '5px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginBottom: '0.4rem',
            }}
          >
            <div style={{ width: `${progress}%`, background: 'var(--accent)', height: '100%', borderRadius: '3px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '400px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <button onClick={playPrevious} disabled={!hasPrevious} style={{ fontSize: '1.2rem', borderRadius: '50%', width: '44px', height: '44px' }}>
              ⏮
            </button>
            <button
              onClick={togglePlay}
              style={{
                background: 'var(--accent)',
                color: '#121212',
                borderRadius: '50%',
                width: '56px',
                height: '56px',
                fontSize: '1.3rem',
              }}
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <button onClick={playNext} disabled={!hasNext} style={{ fontSize: '1.2rem', borderRadius: '50%', width: '44px', height: '44px' }}>
              ⏭
            </button>
          </div>

          <button onClick={() => setShowLyrics(!showLyrics)}>
            {showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}
          </button>

          {showLyrics && (
            <p style={{ maxWidth: '500px', textAlign: 'center', whiteSpace: 'pre-line', color: 'var(--text-muted)', marginTop: '1rem', maxHeight: '30vh', overflowY: 'auto' }}>
              {currentSong.lyrics || 'No lyrics available for this song.'}
            </p>
          )}
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
          padding: '0.7rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 50,
        }}
      >
        <img
          src={currentSong.coverImage || 'https://via.placeholder.com/50'}
          alt={currentSong.title}
          onClick={() => setExpanded(true)}
          style={{ width: '44px', height: '44px', borderRadius: 'var(--radius)', objectFit: 'cover', cursor: 'pointer' }}
        />

        <div style={{ minWidth: '140px', cursor: 'pointer' }} onClick={() => setExpanded(true)}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem' }}>{currentSong.title}</p>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {currentSong.artist?.name}
          </p>
        </div>

        <button onClick={playPrevious} disabled={!hasPrevious} style={{ fontSize: '0.9rem' }}>⏮</button>

        <button
          onClick={togglePlay}
          style={{
            background: 'var(--accent)',
            color: '#121212',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            fontSize: '0.85rem',
          }}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <button onClick={playNext} disabled={!hasNext} style={{ fontSize: '0.9rem' }}>⏭</button>

        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: '32px' }}>
          {formatTime(currentTime)}
        </span>

        <div
          onClick={handleSeekClick}
          style={{
            flex: 1,
            background: 'var(--border)',
            height: '4px',
            borderRadius: '2px',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: `${progress}%`, background: 'var(--accent)', height: '100%' }} />
        </div>

        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: '32px' }}>
          {formatTime(duration)}
        </span>

        <span style={{ fontSize: '0.9rem' }}>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{ width: '80px' }}
        />

        <button
          onClick={stopPlayback}
          style={{
            fontSize: '0.85rem',
            padding: '0.3rem 0.6rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
          }}
          title="Close player"
        >
          ✕
        </button>
      </div>
    </>
  );
};

export default PlayerBar;