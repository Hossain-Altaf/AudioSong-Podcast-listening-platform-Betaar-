import { useState, useEffect, useContext } from 'react';
import { getDownloadedSongs } from '../services/offlineService';
import SongCard from '../components/SongCard';
import { PlayerContext } from '../context/PlayerContext';
import { pageWrap, eyebrow, grid } from '../styles/shared';

const Downloads = () => {
  const [songs, setSongs] = useState([]);
  const { playSong } = useContext(PlayerContext);

  useEffect(() => {
    setSongs(getDownloadedSongs());
  }, []);

  const handlePlay = (song) => {
    playSong(song, songs, songs.findIndex((s) => s._id === song._id));
  };

  return (
    <div style={pageWrap}>
      <p style={eyebrow}>Available offline</p>
      <h1 style={{ margin: '0.2rem 0 1.5rem' }}>Downloads</h1>
      {songs.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No downloads yet. Download songs from Home to listen offline.</p>
      ) : (
        <div style={grid}>
          {songs.map((song) => (
            <SongCard key={song._id} song={song} onPlay={handlePlay} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;