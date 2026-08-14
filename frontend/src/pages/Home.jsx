import { useState, useEffect, useContext } from 'react';
import { getSongs } from '../services/songService';
import SongCard from '../components/SongCard';
import { PlayerContext } from '../context/PlayerContext';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const { playSong } = useContext(PlayerContext);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getSongs();
        setSongs(data);
      } catch (err) {
        setError('Failed to load songs');
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const handlePlay = (song) => {
  playSong(song, filteredSongs, filteredSongs.findIndex((s) => s._id === song._id));
};

  if (loading) return <p>Loading songs...</p>;
  if (error) return <p>{error}</p>;

  // Build a unique genre list from the songs we have
  const genres = ['All', ...new Set(songs.map((s) => s.genre).filter(Boolean))];

  const filteredSongs =
    selectedGenre === 'All' ? songs : songs.filter((s) => s.genre === selectedGenre);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Browse by Category</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '20px',
              border: '1px solid #ccc',
              background: selectedGenre === genre ? '#1db954' : '#fff',
              color: selectedGenre === genre ? '#fff' : '#333',
              cursor: 'pointer',
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      <h2>{selectedGenre === 'All' ? 'All Songs' : selectedGenre}</h2>
      {filteredSongs.length === 0 ? (
        <p>No songs in this category.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {filteredSongs.map((song) => (
            <SongCard key={song._id} song={song} onPlay={handlePlay} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;