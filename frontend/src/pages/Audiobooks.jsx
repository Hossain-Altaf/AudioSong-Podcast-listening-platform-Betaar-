import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAudiobooks } from '../services/audiobookService';

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

  if (loading) return <p>Loading audiobooks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <h2 style={{ marginBottom: '1.25rem' }}>Audiobooks</h2>
      {books.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No audiobooks yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
          {books.map((book) => (
            <Link
              key={book._id}
              to={`/audiobooks/${book._id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.85rem',
                  width: '170px',
                }}
              >
                <img
                  src={book.coverImage || 'https://via.placeholder.com/150'}
                  alt={book.title}
                  style={{ width: '100%', borderRadius: 'var(--radius)', aspectRatio: '1', objectFit: 'cover' }}
                />
                <h4 style={{ margin: '0.6rem 0 0.15rem', fontSize: '0.95rem' }}>{book.title}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {book.author}
                </p>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: 'var(--accent)' }}>
                  {book.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Audiobooks;