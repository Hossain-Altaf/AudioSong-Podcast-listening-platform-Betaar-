import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMyPlaylists, addSongToPlaylist } from '../services/playlistService';
import { downloadSong, removeDownload, isDownloaded } from '../services/offlineService';

const SongCard = ({ song, onPlay }) => {
  const { user } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [downloaded, setDownloaded] = useState(isDownloaded(song._id));
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (showDropdown && user) {
      getMyPlaylists().then(setPlaylists).catch(() => {});
    }
  }, [showDropdown, user]);

  const handleAdd = async (playlistId) => {
    try {
      await addSongToPlaylist(playlistId, song._id);
      setShowDropdown(false);
    } catch (err) {
      console.error('Failed to add song', err);
    }
  };

  const handleDownloadToggle = async () => {
    setDownloading(true);
    try {
      if (downloaded) {
        await removeDownload(song);
        setDownloaded(false);
      } else {
        await downloadSong(song);
        setDownloaded(true);
      }
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '0.75rem',
        width: '160px',
        position: 'relative',
      }}
    >
      <img
        src={song.coverImage || 'https://via.placeholder.com/150'}
        alt={song.title}
        style={{ width: '100%', borderRadius: '4px', cursor: 'pointer' }}
        onClick={() => onPlay(song)}
      />
      <h4 style={{ margin: '0.5rem 0 0.2rem' }}>{song.title}</h4>
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
        {song.artist?.name || 'Unknown Artist'}
      </p>

      {user && (
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowDropdown(!showDropdown)}>+ Playlist</button>
          <button onClick={handleDownloadToggle} disabled={downloading}>
            {downloading ? '...' : downloaded ? '✓ Downloaded' : '⬇ Download'}
          </button>
        </div>
      )}

      {showDropdown && (
        <div style={{ border: '1px solid #ccc', marginTop: '0.3rem', background: '#fff' }}>
          {playlists.length === 0 ? (
            <p style={{ fontSize: '0.8rem', padding: '0.3rem' }}>No playlists yet</p>
          ) : (
            playlists.map((p) => (
              <div
                key={p._id}
                style={{ padding: '0.3rem', cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => handleAdd(p._id)}
              >
                {p.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SongCard;