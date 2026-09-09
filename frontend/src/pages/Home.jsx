import { useState, useEffect, useContext } from 'react';
import { getSongs } from '../services/songService';
import SongCard from '../components/SongCard';
import { PlayerContext } from '../context/PlayerContext';
import { pageWrap, eyebrow, grid } from '../styles/shared';

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

  const filteredSongs =
    selectedGenre === 'All' ? songs : songs.filter((s) => s.genre === selectedGenre);

  const handlePlay = (song) => {
    playSong(song, filteredSongs, filteredSongs.findIndex((s) => s._id === song._id));
  };

  if (loading) return <p style={pageWrap}>Loading songs...</p>;
  if (error) return <p style={pageWrap}>{error}</p>;

  const genres = ['All', ...new Set(songs.map((s) => s.genre).filter(Boolean))];

  return (
    <div style={pageWrap}>
      <p style={eyebrow}>Discover</p>
      <h1 style={{ margin: '0.2rem 0 1.5rem' }}>Browse Music</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              background: selectedGenre === genre ? 'var(--accent)' : 'var(--surface)',
              color: selectedGenre === genre ? '#121212' : 'var(--text)',
              fontWeight: selectedGenre === genre ? 600 : 400,
              border: selectedGenre === genre ? 'none' : '1px solid var(--border)',
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      <h3 style={{ marginBottom: '1rem' }}>
        {selectedGenre === 'All' ? 'All Songs' : selectedGenre}
      </h3>

      {filteredSongs.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No songs in this category.</p>
      ) : (
        <div style={grid}>
          {filteredSongs.map((song) => (
            <SongCard key={song._id} song={song} onPlay={handlePlay} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;