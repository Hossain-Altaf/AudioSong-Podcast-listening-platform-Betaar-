import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPodcasts } from '../services/podcastService';

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

  if (loading) return <p>Loading podcasts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Podcasts</h2>
      {podcasts.length === 0 ? (
        <p>No podcasts yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {podcasts.map((podcast) => (
            <Link
              key={podcast._id}
              to={`/podcasts/${podcast._id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  width: '160px',
                }}
              >
                <img
                  src={podcast.coverImage || 'https://via.placeholder.com/150'}
                  alt={podcast.title}
                  style={{ width: '100%', borderRadius: '4px' }}
                />
                <h4 style={{ margin: '0.5rem 0 0.2rem' }}>{podcast.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                  {podcast.host?.name}
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#999' }}>
                  {podcast.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Podcasts;