import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { card, eyebrow, primaryButton, fieldStyle, labelStyle, inputStyle } from '../styles/shared';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser(formData);
      login(data);
      navigate(data.role === 'artist' ? '/artist/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 1rem' }}>
      <div style={{ ...card, padding: '2rem', width: '100%', maxWidth: '380px' }}>
        <p style={eyebrow}>Welcome back</p>
        <h2 style={{ margin: '0.2rem 0 1.5rem' }}>Log In</h2>

        {error && <p style={{ color: 'var(--danger)', marginTop: 0 }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input style={inputStyle} type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" style={{ ...primaryButton, marginTop: '0.5rem' }}>Log In</button>
        </form>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1.5rem', textAlign: 'center' }}>
          No account? <Link to="/register" style={{ color: 'var(--accent)' }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;