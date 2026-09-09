import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMyPlaylists, addSongToPlaylist } from '../services/playlistService';
import { downloadSong, removeDownload, isDownloaded } from '../services/offlineService';
import { mediaCard } from '../styles/shared';

const SongCard = ({ song, onPlay }) => {
  const { user } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [downloaded, setDownloaded] = useState(isDownloaded(song._id));
  const [downloading, setDownloading] = useState(false);
  const [hovered, setHovered] = useState(false);

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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...mediaCard,
        position: 'relative',
        borderColor: hovered ? 'var(--accent)' : 'var(--border)',
      }}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={song.coverImage || 'https://via.placeholder.com/150'}
          alt={song.title}
          onClick={() => onPlay(song)}
          style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'var(--radius)', cursor: 'pointer' }}
        />
        {hovered && (
          <div
            onClick={() => onPlay(song)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
            }}
          >
            <div style={{
              background: 'var(--accent)',
              color: '#121212',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}>
              ▶
            </div>
          </div>
        )}
      </div>

      <h4 style={{ margin: '0.65rem 0 0.15rem', fontSize: '0.92rem' }}>{song.title}</h4>
      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        {song.artist?.name || 'Unknown Artist'}
      </p>

      {user && (
        <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
          >
            + Playlist
          </button>
          <button
            onClick={handleDownloadToggle}
            disabled={downloading}
            style={{
              fontSize: '0.75rem',
              padding: '0.3rem 0.6rem',
              color: downloaded ? 'var(--accent)' : 'var(--text)',
            }}
          >
            {downloading ? '...' : downloaded ? '✓ Saved' : '⬇ Download'}
          </button>
        </div>
      )}

      {showDropdown && (
        <div style={{
          position: 'absolute',
          zIndex: 10,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          marginTop: '0.3rem',
          width: '150px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          {playlists.length === 0 ? (
            <p style={{ fontSize: '0.78rem', padding: '0.5rem', margin: 0, color: 'var(--text-muted)' }}>No playlists yet</p>
          ) : (
            playlists.map((p) => (
              <div
                key={p._id}
                onClick={() => handleAdd(p._id)}
                style={{ padding: '0.5rem 0.6rem', cursor: 'pointer', fontSize: '0.82rem' }}
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