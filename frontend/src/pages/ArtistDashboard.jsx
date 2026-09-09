import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { uploadSong } from '../services/songService';
import { createPodcast } from '../services/podcastService';
import { createAudiobook } from '../services/audiobookService';

const inputStyle = { width: '100%', marginTop: '0.3rem' };
const fieldStyle = { marginBottom: '1.1rem' };
const labelStyle = { fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 };

const ArtistDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('song');

  // ---- Song upload state ----
  const [formData, setFormData] = useState({ title: '', genre: '', lyrics: '' });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!audioFile) {
      setError('Please select an audio file');
      return;
    }
    const data = new FormData();
    data.append('title', formData.title);
    data.append('genre', formData.genre);
    data.append('lyrics', formData.lyrics);
    data.append('audio', audioFile);
    if (coverFile) data.append('cover', coverFile);

    try {
      setUploading(true);
      await uploadSong(data);
      setMessage('Song uploaded successfully!');
      setFormData({ title: '', genre: '', lyrics: '' });
      setAudioFile(null);
      setCoverFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // ---- Podcast state ----
  const [podcastData, setPodcastData] = useState({ title: '', description: '', category: '' });
  const [podcastCover, setPodcastCover] = useState(null);
  const [podcastMessage, setPodcastMessage] = useState('');
  const [podcastError, setPodcastError] = useState('');
  const [creatingPodcast, setCreatingPodcast] = useState(false);

  const handlePodcastChange = (e) => setPodcastData({ ...podcastData, [e.target.name]: e.target.value });

  const handlePodcastSubmit = async (e) => {
    e.preventDefault();
    setPodcastError('');
    setPodcastMessage('');
    const data = new FormData();
    data.append('title', podcastData.title);
    data.append('description', podcastData.description);
    data.append('category', podcastData.category);
    if (podcastCover) data.append('cover', podcastCover);

    try {
      setCreatingPodcast(true);
      await createPodcast(data);
      setPodcastMessage('Podcast created! Add episodes from the Podcasts page.');
      setPodcastData({ title: '', description: '', category: '' });
      setPodcastCover(null);
      e.target.reset();
    } catch (err) {
      setPodcastError(err.response?.data?.message || 'Failed to create podcast');
    } finally {
      setCreatingPodcast(false);
    }
  };

  // ---- Audiobook state ----
  const [bookData, setBookData] = useState({ title: '', author: '', narrator: '', description: '', category: '' });
  const [bookCover, setBookCover] = useState(null);
  const [bookMessage, setBookMessage] = useState('');
  const [bookError, setBookError] = useState('');
  const [creatingBook, setCreatingBook] = useState(false);

  const handleBookChange = (e) => setBookData({ ...bookData, [e.target.name]: e.target.value });

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setBookError('');
    setBookMessage('');
    const data = new FormData();
    Object.entries(bookData).forEach(([key, val]) => data.append(key, val));
    if (bookCover) data.append('cover', bookCover);

    try {
      setCreatingBook(true);
      await createAudiobook(data);
      setBookMessage('Audiobook created! Add chapters from the Audiobooks page.');
      setBookData({ title: '', author: '', narrator: '', description: '', category: '' });
      setBookCover(null);
      e.target.reset();
    } catch (err) {
      setBookError(err.response?.data?.message || 'Failed to create audiobook');
    } finally {
      setCreatingBook(false);
    }
  };

  const tabs = [
    { id: 'song', label: '🎵 Upload Song' },
    { id: 'podcast', label: '🎙 New Podcast' },
    { id: 'audiobook', label: '📖 New Audiobook' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--accent)', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
          Artist Studio
        </p>
        <h1 style={{ fontSize: '1.9rem', margin: '0.2rem 0' }}>Welcome, {user?.name}</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Upload and manage your content</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              borderRadius: 0,
              padding: '0.7rem 1rem',
              color: activeTab === tab.id ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: activeTab === tab.id ? 600 : 500,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Card containing the active form */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
        }}
      >
        {activeTab === 'song' && (
          <>
            <h3 style={{ marginBottom: '1.25rem' }}>Upload a New Song</h3>
            {message && <p style={{ color: 'var(--success)' }}>{message}</p>}
            {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} type="text" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Genre</label>
                <input style={inputStyle} type="text" name="genre" placeholder="e.g. Pop, Rock, Hip-Hop" value={formData.genre} onChange={handleChange} required />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Lyrics (optional)</label>
                <textarea style={inputStyle} name="lyrics" rows="5" value={formData.lyrics} onChange={handleChange} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Audio File (mp3/wav)</label><br />
                <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} required />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Cover Image (optional)</label><br />
                <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} />
              </div>
              <button type="submit" disabled={uploading} style={{ background: 'var(--accent)', color: '#121212', fontWeight: 600, width: '100%' }}>
                {uploading ? 'Uploading...' : 'Upload Song'}
              </button>
            </form>
          </>
        )}

        {activeTab === 'podcast' && (
          <>
            <h3 style={{ marginBottom: '1.25rem' }}>Create a New Podcast</h3>
            {podcastMessage && <p style={{ color: 'var(--success)' }}>{podcastMessage}</p>}
            {podcastError && <p style={{ color: 'var(--danger)' }}>{podcastError}</p>}

            <form onSubmit={handlePodcastSubmit}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Podcast Title</label>
                <input style={inputStyle} type="text" name="title" value={podcastData.title} onChange={handlePodcastChange} required />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Description</label>
                <textarea style={inputStyle} name="description" rows="4" value={podcastData.description} onChange={handlePodcastChange} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Category</label>
                <input style={inputStyle} type="text" name="category" placeholder="e.g. Technology, Comedy, News" value={podcastData.category} onChange={handlePodcastChange} required />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Cover Image (optional)</label><br />
                <input type="file" accept="image/*" onChange={(e) => setPodcastCover(e.target.files[0])} />
              </div>
              <button type="submit" disabled={creatingPodcast} style={{ background: 'var(--accent)', color: '#121212', fontWeight: 600, width: '100%' }}>
                {creatingPodcast ? 'Creating...' : 'Create Podcast'}
              </button>
            </form>
          </>
        )}

        {activeTab === 'audiobook' && (
          <>
            <h3 style={{ marginBottom: '1.25rem' }}>Create a New Audiobook</h3>
            {bookMessage && <p style={{ color: 'var(--success)' }}>{bookMessage}</p>}
            {bookError && <p style={{ color: 'var(--danger)' }}>{bookError}</p>}

            <form onSubmit={handleBookSubmit}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Book Title</label>
                <input style={inputStyle} type="text" name="title" value={bookData.title} onChange={handleBookChange} required />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Author</label>
                <input style={inputStyle} type="text" name="author" value={bookData.author} onChange={handleBookChange} required />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Narrator (optional)</label>
                <input style={inputStyle} type="text" name="narrator" value={bookData.narrator} onChange={handleBookChange} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Description</label>
                <textarea style={inputStyle} name="description" rows="4" value={bookData.description} onChange={handleBookChange} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Category</label>
                <input style={inputStyle} type="text" name="category" placeholder="e.g. Fiction, Self-Help, Sci-Fi" value={bookData.category} onChange={handleBookChange} required />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Cover Image (optional)</label><br />
                <input type="file" accept="image/*" onChange={(e) => setBookCover(e.target.files[0])} />
              </div>
              <button type="submit" disabled={creatingBook} style={{ background: 'var(--accent)', color: '#121212', fontWeight: 600, width: '100%' }}>
                {creatingBook ? 'Creating...' : 'Create Audiobook'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ArtistDashboard;