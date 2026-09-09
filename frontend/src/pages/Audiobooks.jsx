import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAudiobooks } from '../services/audiobookService';
import { pageWrap, eyebrow, grid, mediaCard } from '../styles/shared';

const Audiobooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAudiobooks();
        setBooks(data);
      } catch (err) {
        setError('Failed to load audiobooks');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) return <p style={pageWrap}>Loading audiobooks...</p>;
  if (error) return <p style={pageWrap}>{error}</p>;

  return (
    <div style={pageWrap}>
      <p style={eyebrow}>Read & listen</p>
      <h1 style={{ margin: '0.2rem 0 1.5rem' }}>Audiobooks</h1>

      {books.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No audiobooks yet.</p>
      ) : (
        <div style={grid}>
          {books.map((book) => (
            <Link key={book._id} to={`/audiobooks/${book._id}`} style={{ textDecoration: 'none' }}>
              <div style={mediaCard}>
                <img
                  src={book.coverImage || 'https://via.placeholder.com/150'}
                  alt={book.title}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'var(--radius)' }}
                />
                <h4 style={{ margin: '0.6rem 0 0.15rem', fontSize: '0.92rem' }}>{book.title}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{book.author}</p>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: 'var(--accent)' }}>{book.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Audiobooks;