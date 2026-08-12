import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getPodcastById, addEpisode } from '../services/podcastService';
import { PlayerContext } from '../context/PlayerContext';
import { AuthContext } from '../context/AuthContext';

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
      title: episode.title,
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!podcast) return null;

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <img
          src={podcast.coverImage || 'https://via.placeholder.com/150'}
          alt={podcast.title}
          style={{ width: '150px', borderRadius: '8px' }}
        />
        <div>
          <h2>{podcast.title}</h2>
          <p style={{ color: '#666' }}>{podcast.host?.name}</p>
          <p>{podcast.description}</p>
          <p style={{ fontSize: '0.85rem', color: '#999' }}>{podcast.category}</p>
        </div>
      </div>

      <h3>Episodes</h3>
      {podcast.episodes.length === 0 ? (
        <p>No episodes yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {podcast.episodes.map((ep) => (
            <li
              key={ep._id}
              onClick={() => handlePlayEpisode(ep)}
              style={{
                padding: '0.75rem',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
              }}
            >
              Ep {ep.episodeNumber}: {ep.title}
            </li>
          ))}
        </ul>
      )}

      {user && podcast.host?._id === user._id && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <h3>Add Episode</h3>
          {epMessage && <p style={{ color: 'green' }}>{epMessage}</p>}
          {epError && <p style={{ color: 'red' }}>{epError}</p>}

          <form onSubmit={handleAddEpisode}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Episode Title</label><br />
              <input
                type="text"
                value={epTitle}
                onChange={(e) => setEpTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label>Episode Number</label><br />
              <input
                type="number"
                value={epNumber}
                onChange={(e) => setEpNumber(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label>Audio File</label><br />
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setEpAudio(e.target.files[0])}
                required
              />
            </div>

            <button type="submit" disabled={uploadingEp}>
              {uploadingEp ? 'Uploading...' : 'Add Episode'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PodcastDetail;