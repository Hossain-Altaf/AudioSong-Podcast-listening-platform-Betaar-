import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getAudiobookById, addChapter } from '../services/audiobookService';
import { PlayerContext } from '../context/PlayerContext';
import { AuthContext } from '../context/AuthContext';

const AudiobookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { playSong } = useContext(PlayerContext);
  const { user } = useContext(AuthContext);

  const [chTitle, setChTitle] = useState('');
  const [chNumber, setChNumber] = useState('');
  const [chAudio, setChAudio] = useState(null);
  const [chMessage, setChMessage] = useState('');
  const [chError, setChError] = useState('');
  const [uploadingCh, setUploadingCh] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getAudiobookById(id);
        setBook(data);
      } catch (err) {
        setError('Failed to load audiobook');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handlePlayChapter = (chapter) => {
    playSong({
      _id: chapter._id,
      title: `${book.title} — ${chapter.title}`,
      audioUrl: chapter.audioUrl,
      artist: { name: book.narrator || book.author },
      coverImage: book.coverImage,
    });
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    setChError('');
    setChMessage('');

    if (!chAudio) {
      setChError('Please select an audio file');
      return;
    }

    const data = new FormData();
    data.append('title', chTitle);
    data.append('chapterNumber', chNumber);
    data.append('audio', chAudio);

    try {
      setUploadingCh(true);
      const updated = await addChapter(book._id, data);
      setBook(updated);
      setChMessage('Chapter added!');
      setChTitle('');
      setChNumber('');
      setChAudio(null);
      e.target.reset();
    } catch (err) {
      setChError(err.response?.data?.message || 'Failed to add chapter');
    } finally {
      setUploadingCh(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return null;

  return (
    <div style={{ padding: '1.5rem 2rem', maxWidth: '700px' }}>
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <img
          src={book.coverImage || 'https://via.placeholder.com/150'}
          alt={book.title}
          style={{ width: '150px', borderRadius: 'var(--radius-lg)', objectFit: 'cover' }}
        />
        <div>
          <h2>{book.title}</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.3rem 0' }}>by {book.author}</p>
          {book.narrator && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>
              Narrated by {book.narrator}
            </p>
          )}
          <p style={{ marginTop: '0.6rem' }}>{book.description}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{book.category}</p>
        </div>
      </div>

      <h3 style={{ marginBottom: '0.75rem' }}>Chapters</h3>
      {book.chapters.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No chapters yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {book.chapters
            .slice()
            .sort((a, b) => a.chapterNumber - b.chapterNumber)
            .map((ch) => (
              <li
                key={ch._id}
                onClick={() => handlePlayChapter(ch)}
                style={{
                  padding: '0.75rem 0',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                }}
              >
                Chapter {ch.chapterNumber}: {ch.title}
              </li>
            ))}
        </ul>
      )}

      {user && book.uploadedBy?._id === user._id && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <h3 style={{ marginBottom: '0.75rem' }}>Add Chapter</h3>
          {chMessage && <p style={{ color: 'var(--success)' }}>{chMessage}</p>}
          {chError && <p style={{ color: 'var(--danger)' }}>{chError}</p>}

          <form onSubmit={handleAddChapter}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Chapter Title</label><br />
              <input type="text" value={chTitle} onChange={(e) => setChTitle(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Chapter Number</label><br />
              <input type="number" value={chNumber} onChange={(e) => setChNumber(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Audio File</label><br />
              <input type="file" accept="audio/*" onChange={(e) => setChAudio(e.target.files[0])} required />
            </div>
            <button type="submit" disabled={uploadingCh}>
              {uploadingCh ? 'Uploading...' : 'Add Chapter'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AudiobookDetail;