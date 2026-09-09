import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getPodcastById, addEpisode } from '../services/podcastService';
import { PlayerContext } from '../context/PlayerContext';
import { AuthContext } from '../context/AuthContext';
import { pageWrap, eyebrow, card, fieldStyle, labelStyle, inputStyle, primaryButton } from '../styles/shared';

const PodcastDetail = () => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { playSong } = useContext(PlayerContext);
  const { user } = useContext(AuthContext);

  const [epTitle, setEpTitle] = useState('');
  const [epNumber, setEpNumber] = useState('');
  const [epAudio, setEpAudio] = useState(null);
  const [epMessage, setEpMessage] = useState('');
  const [epError, setEpError] = useState('');
  const [uploadingEp, setUploadingEp] = useState(false);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const data = await getPodcastById(id);
        setPodcast(data);
      } catch (err) {
        setError('Failed to load podcast');
      } finally {
        setLoading(false);
      }
    };
    fetchPodcast();
  }, [id]);

  const handlePlayEpisode = (episode) => {
    playSong({
      _id: episode._id,
      title: `${podcast.title} — ${episode.title}`,
      audioUrl: episode.audioUrl,
      artist: podcast.host,
      coverImage: podcast.coverImage,
    });
  };

  const handleAddEpisode = async (e) => {
    e.preventDefault();
    setEpError('');
    setEpMessage('');
    if (!epAudio) {
      setEpError('Please select an audio file');
      return;
    }
    const data = new FormData();
    data.append('title', epTitle);
    data.append('episodeNumber', epNumber);
    data.append('audio', epAudio);

    try {
      setUploadingEp(true);
      const updatedPodcast = await addEpisode(podcast._id, data);
      setPodcast(updatedPodcast);
      setEpMessage('Episode added!');
      setEpTitle('');
      setEpNumber('');
      setEpAudio(null);
      e.target.reset();
    } catch (err) {
      setEpError(err.response?.data?.message || 'Failed to add episode');
    } finally {
      setUploadingEp(false);
    }
  };

  if (loading) return <p style={pageWrap}>Loading...</p>;
  if (error) return <p style={pageWrap}>{error}</p>;
  if (!podcast) return null;

  return (
    <div style={{ ...pageWrap, maxWidth: '720px' }}>
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <img
          src={podcast.coverImage || 'https://via.placeholder.com/150'}
          alt={podcast.title}
          style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
        />
        <div>
          <p style={eyebrow}>{podcast.category}</p>
          <h1 style={{ margin: '0.2rem 0' }}>{podcast.title}</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0' }}>Hosted by {podcast.host?.name}</p>
          <p style={{ marginTop: '0.6rem' }}>{podcast.description}</p>
        </div>
      </div>

      <h3 style={{ marginBottom: '0.75rem' }}>Episodes</h3>
      {podcast.episodes.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No episodes yet.</p>
      ) : (
        <div style={{ ...card, padding: '0.5rem 1rem' }}>
          {podcast.episodes.map((ep, i) => (
            <div
              key={ep._id}
              onClick={() => handlePlayEpisode(ep)}
              style={{
                padding: '0.85rem 0',
                borderBottom: i < podcast.episodes.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'var(--accent)', fontWeight: 600, minWidth: '24px' }}>{ep.episodeNumber}</span>
              <span>{ep.title}</span>
            </div>
          ))}
        </div>
      )}

      {user && podcast.host?._id === user._id && (
        <div style={{ ...card, padding: '1.5rem', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add Episode</h3>
          {epMessage && <p style={{ color: 'var(--success)' }}>{epMessage}</p>}
          {epError && <p style={{ color: 'var(--danger)' }}>{epError}</p>}

          <form onSubmit={handleAddEpisode}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Episode Title</label>
              <input style={inputStyle} type="text" value={epTitle} onChange={(e) => setEpTitle(e.target.value)} required />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Episode Number</label>
              <input style={inputStyle} type="number" value={epNumber} onChange={(e) => setEpNumber(e.target.value)} required />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Audio File</label><br />
              <input type="file" accept="audio/*" onChange={(e) => setEpAudio(e.target.files[0])} required />
            </div>
            <button type="submit" disabled={uploadingEp} style={primaryButton}>
              {uploadingEp ? 'Uploading...' : 'Add Episode'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PodcastDetail;