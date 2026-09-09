import { useState, useEffect, useContext } from 'react';
import { getMyPlaylists, createPlaylist } from '../services/playlistService';
import { PlayerContext } from '../context/PlayerContext';
import { pageWrap, eyebrow, card, primaryButton } from '../styles/shared';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { playSong } = useContext(PlayerContext);

  const fetchPlaylists = async () => {
    try {
      const data = await getMyPlaylists();
      setPlaylists(data);
    } catch (err) {
      setError('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createPlaylist({ name: newName, isPublic: true });
      setNewName('');
      fetchPlaylists();
    } catch (err) {
      setError('Failed to create playlist');
    }
  };

  if (loading) return <p style={pageWrap}>Loading playlists...</p>;

  return (
    <div style={pageWrap}>
      <p style={eyebrow}>Your collections</p>
      <h1 style={{ margin: '0.2rem 0 1.5rem' }}>Playlists</h1>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="New playlist name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ flex: 1, maxWidth: '300px' }}
        />
        <button type="submit" style={{ background: 'var(--accent)', color: '#121212', fontWeight: 600 }}>
          Create
        </button>
      </form>

      {playlists.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>You haven't created any playlists yet.</p>
      ) : (
        playlists.map((playlist) => (
          <div key={playlist._id} style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>{playlist.name}</h3>
            {playlist.songs.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No songs added yet.</p>
            ) : (
              playlist.songs.map((song, i) => (
                <div
                  key={song._id}
                  onClick={() =>
                    playSong(song, playlist.songs, playlist.songs.findIndex((s) => s._id === song._id))
                  }
                  style={{
                    padding: '0.6rem 0',
                    borderBottom: i < playlist.songs.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  {song.title} <span style={{ color: 'var(--text-muted)' }}>— {song.artist?.name}</span>
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Playlists;