import { useState, useEffect, useContext } from 'react';
import { getMyPlaylists, createPlaylist } from '../services/playlistService';
import { PlayerContext } from '../context/PlayerContext';

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

  if (loading) return <p>Loading playlists...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>My Playlists</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleCreate} style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="New playlist name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit">Create Playlist</button>
      </form>

      {playlists.length === 0 ? (
        <p>You haven't created any playlists yet.</p>
      ) : (
        playlists.map((playlist) => (
          <div
            key={playlist._id}
            style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}
          >
            <h3>{playlist.name}</h3>
            {playlist.songs.length === 0 ? (
              <p style={{ color: '#888' }}>No songs added yet.</p>
            ) : (
              <ul>
                {playlist.songs.map((song) => (
                  <li
                    key={song._id}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      playSong(
                        song,
                        playlist.songs,
                        playlist.songs.findIndex((s) => s._id === song._id)
                      )
                    }
                  >
                    {song.title} — {song.artist?.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Playlists;