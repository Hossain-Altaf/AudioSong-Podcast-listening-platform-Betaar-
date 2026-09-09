import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPodcasts } from '../services/podcastService';
import { pageWrap, eyebrow, grid, mediaCard } from '../styles/shared';

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const data = await getPodcasts();
        setPodcasts(data);
      } catch (err) {
        setError('Failed to load podcasts');
      } finally {
        setLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  if (loading) return <p style={pageWrap}>Loading podcasts...</p>;
  if (error) return <p style={pageWrap}>{error}</p>;

  return (
    <div style={pageWrap}>
      <p style={eyebrow}>Talk & stories</p>
      <h1 style={{ margin: '0.2rem 0 1.5rem' }}>Podcasts</h1>

      {podcasts.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No podcasts yet.</p>
      ) : (
        <div style={grid}>
          {podcasts.map((podcast) => (
            <Link key={podcast._id} to={`/podcasts/${podcast._id}`} style={{ textDecoration: 'none' }}>
              <div style={mediaCard}>
                <img
                  src={podcast.coverImage || 'https://via.placeholder.com/150'}
                  alt={podcast.title}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'var(--radius)' }}
                />
                <h4 style={{ margin: '0.6rem 0 0.15rem', fontSize: '0.92rem' }}>{podcast.title}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{podcast.host?.name}</p>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: 'var(--accent)' }}>{podcast.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Podcasts;