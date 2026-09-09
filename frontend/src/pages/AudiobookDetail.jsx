import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getAudiobookById, addChapter } from '../services/audiobookService';
import { PlayerContext } from '../context/PlayerContext';
import { AuthContext } from '../context/AuthContext';
import { pageWrap, eyebrow, card, fieldStyle, labelStyle, inputStyle, primaryButton } from '../styles/shared';

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

  if (loading) return <p style={pageWrap}>Loading...</p>;
  if (error) return <p style={pageWrap}>{error}</p>;
  if (!book) return null;

  return (
    <div style={{ ...pageWrap, maxWidth: '720px' }}>
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <img
          src={book.coverImage || 'https://via.placeholder.com/150'}
          alt={book.title}
          style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
        />
        <div>
          <p style={eyebrow}>{book.category}</p>
          <h1 style={{ margin: '0.2rem 0' }}>{book.title}</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0' }}>by {book.author}</p>
          {book.narrator && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>
              Narrated by {book.narrator}
            </p>
          )}
          <p style={{ marginTop: '0.6rem' }}>{book.description}</p>
        </div>
      </div>

      <h3 style={{ marginBottom: '0.75rem' }}>Chapters</h3>
      {book.chapters.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No chapters yet.</p>
      ) : (
        <div style={{ ...card, padding: '0.5rem 1rem' }}>
          {book.chapters
            .slice()
            .sort((a, b) => a.chapterNumber - b.chapterNumber)
            .map((ch, i, arr) => (
              <div
                key={ch._id}
                onClick={() => handlePlayChapter(ch)}
                style={{
                  padding: '0.85rem 0',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: 'var(--accent)', fontWeight: 600, minWidth: '24px' }}>{ch.chapterNumber}</span>
                <span>{ch.title}</span>
              </div>
            ))}
        </div>
      )}

      {user && book.uploadedBy?._id === user._id && (
        <div style={{ ...card, padding: '1.5rem', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add Chapter</h3>
          {chMessage && <p style={{ color: 'var(--success)' }}>{chMessage}</p>}
          {chError && <p style={{ color: 'var(--danger)' }}>{chError}</p>}

          <form onSubmit={handleAddChapter}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Chapter Title</label>
              <input style={inputStyle} type="text" value={chTitle} onChange={(e) => setChTitle(e.target.value)} required />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Chapter Number</label>
              <input style={inputStyle} type="number" value={chNumber} onChange={(e) => setChNumber(e.target.value)} required />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Audio File</label><br />
              <input type="file" accept="audio/*" onChange={(e) => setChAudio(e.target.files[0])} required />
            </div>
            <button type="submit" disabled={uploadingCh} style={primaryButton}>
              {uploadingCh ? 'Uploading...' : 'Add Chapter'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AudiobookDetail;