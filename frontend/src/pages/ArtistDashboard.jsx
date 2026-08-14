import { useState } from 'react';
import { uploadSong } from '../services/songService';
import { createPodcast } from '../services/podcastService';
import { createAudiobook } from '../services/audiobookService';

const ArtistDashboard = () => {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    lyrics: '',
  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  // Add these state variables alongside your existing ones
const [podcastData, setPodcastData] = useState({
  title: '',
  description: '',
  category: '',
});
const [podcastCover, setPodcastCover] = useState(null);
const [podcastMessage, setPodcastMessage] = useState('');
const [podcastError, setPodcastError] = useState('');
const [creatingPodcast, setCreatingPodcast] = useState(false);

const handlePodcastChange = (e) => {
  setPodcastData({ ...podcastData, [e.target.name]: e.target.value });
};

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

  const [bookData, setBookData] = useState({
  title: '',
  author: '',
  narrator: '',
  description: '',
  category: '',
});
const [bookCover, setBookCover] = useState(null);
const [bookMessage, setBookMessage] = useState('');
const [bookError, setBookError] = useState('');
const [creatingBook, setCreatingBook] = useState(false);

const handleBookChange = (e) => {
  setBookData({ ...bookData, [e.target.name]: e.target.value });
};

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

  return (
    <div style={{ padding: '1rem', maxWidth: '500px' }}>
      <h2>Artist Dashboard</h2>
      <h3>Upload a New Song</h3>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Title</label><br />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Genre</label><br />
          <input
            type="text"
            name="genre"
            placeholder="e.g. Pop, Rock, Hip-Hop"
            value={formData.genre}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Lyrics (optional)</label><br />
          <textarea
            name="lyrics"
            rows="6"
            value={formData.lyrics}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Audio File (mp3/wav)</label><br />
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Cover Image (optional)</label><br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
          />
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Song'}
        </button>
      </form>

     <hr style={{ margin: '2rem 0' }} />

<h3>Create a New Podcast</h3>

{podcastMessage && <p style={{ color: 'green' }}>{podcastMessage}</p>}
{podcastError && <p style={{ color: 'red' }}>{podcastError}</p>}

<form onSubmit={handlePodcastSubmit}>
  <div style={{ marginBottom: '1rem' }}>
    <label>Podcast Title</label><br />
    <input
      type="text"
      name="title"
      value={podcastData.title}
      onChange={handlePodcastChange}
      required
    />
  </div>

  <div style={{ marginBottom: '1rem' }}>
    <label>Description</label><br />
    <textarea
      name="description"
      rows="4"
      value={podcastData.description}
      onChange={handlePodcastChange}
    />
  </div>

  <div style={{ marginBottom: '1rem' }}>
    <label>Category</label><br />
    <input
      type="text"
      name="category"
      placeholder="e.g. Technology, Comedy, News"
      value={podcastData.category}
      onChange={handlePodcastChange}
      required
    />
  </div>

  <div style={{ marginBottom: '1rem' }}>
    <label>Cover Image (optional)</label><br />
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setPodcastCover(e.target.files[0])}
    />
  </div>

  <button type="submit" disabled={creatingPodcast}>
    {creatingPodcast ? 'Creating...' : 'Create Podcast'}
  </button>
</form>

 <hr style={{ margin: '2rem 0', borderColor: 'var(--border)' }} />

<h3>Create a New Audiobook</h3>
{bookMessage && <p style={{ color: 'var(--success)' }}>{bookMessage}</p>}
{bookError && <p style={{ color: 'var(--danger)' }}>{bookError}</p>}

<form onSubmit={handleBookSubmit}>
  <div style={{ marginBottom: '1rem' }}>
    <label>Book Title</label><br />
    <input type="text" name="title" value={bookData.title} onChange={handleBookChange} required />
  </div>
  <div style={{ marginBottom: '1rem' }}>
    <label>Author</label><br />
    <input type="text" name="author" value={bookData.author} onChange={handleBookChange} required />
  </div>
  <div style={{ marginBottom: '1rem' }}>
    <label>Narrator (optional)</label><br />
    <input type="text" name="narrator" value={bookData.narrator} onChange={handleBookChange} />
  </div>
  <div style={{ marginBottom: '1rem' }}>
    <label>Description</label><br />
    <textarea name="description" rows="4" value={bookData.description} onChange={handleBookChange} />
  </div>
  <div style={{ marginBottom: '1rem' }}>
    <label>Category</label><br />
    <input type="text" name="category" placeholder="e.g. Fiction, Self-Help, Sci-Fi" value={bookData.category} onChange={handleBookChange} required />
  </div>
  <div style={{ marginBottom: '1rem' }}>
    <label>Cover Image (optional)</label><br />
    <input type="file" accept="image/*" onChange={(e) => setBookCover(e.target.files[0])} />
  </div>
  <button type="submit" disabled={creatingBook}>
    {creatingBook ? 'Creating...' : 'Create Audiobook'}
  </button>
</form>

    </div>
  );
};

export default ArtistDashboard;