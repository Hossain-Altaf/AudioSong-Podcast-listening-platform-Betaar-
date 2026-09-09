import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/authService';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', bio: '', password: '' });
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setFormData({ name: data.name, email: data.email, bio: data.bio || '', password: '' });
        setPreview(data.profilePicture);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('bio', formData.bio);
    if (formData.password) data.append('password', formData.password);
    if (picture) data.append('profilePicture', picture);

    try {
      setSaving(true);
      const updated = await updateProfile(data);

      // Update AuthContext + localStorage with fresh info, keeping the existing token
      const stored = JSON.parse(localStorage.getItem('user'));
      login({ ...stored, ...updated });

      setMessage('Profile updated!');
      setFormData({ ...formData, password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: '1.5rem' }}>Loading profile...</p>;

  return (
    <div style={{ padding: '1.5rem 2rem', maxWidth: '480px' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>My Profile</h2>

      {message && <p style={{ color: 'var(--success)' }}>{message}</p>}
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <img
          src={preview || 'https://via.placeholder.com/80'}
          alt="Profile"
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
        />
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Profile Picture</label><br />
          <input type="file" accept="image/*" onChange={handlePictureChange} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name</label><br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Bio {user?.role === 'artist' ? '' : '(optional)'}</label><br />
          <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label>New Password (leave blank to keep current)</label><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Account type: <span style={{ color: 'var(--accent)' }}>{user?.role}</span>
      </div>
    </div>
  );
};

export default Profile;