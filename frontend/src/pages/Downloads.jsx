import { useState, useEffect, useContext } from 'react';
import { getDownloadedSongs } from '../services/offlineService';
import SongCard from '../components/SongCard';
import { PlayerContext } from '../context/PlayerContext';

const Downloads = () => {
  const [songs, setSongs] = useState([]);
  const { playSong } = useContext(PlayerContext);

  useEffect(() => {
    setSongs(getDownloadedSongs());
  }, []);

  const handlePlay = (song) => {
    playSong(song);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Downloaded Songs</h2>
      {songs.length === 0 ? (
        <p>No downloads yet. Download songs from the Home page to listen offline.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {songs.map((song) => (
            <SongCard key={song._id} song={song} onPlay={handlePlay} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;