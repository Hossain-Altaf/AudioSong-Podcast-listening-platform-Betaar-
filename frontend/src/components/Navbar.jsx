import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: 500,
    letterSpacing: '0.02em',
    transition: 'color 0.15s ease',
  };

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.75rem',
        padding: '1.1rem 2rem',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
      }}
    >
      <Link
        to="/"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--accent)',
          textDecoration: 'none',
          marginRight: '0.5rem',
        }}
      >
        Betaar
      </Link>

      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/podcasts" style={linkStyle}>Podcasts</Link>
      <Link to="/audiobooks" style={linkStyle}>Audiobooks</Link>

      {user && user.role === 'artist' && (
        <>
        <Link to="/artist/dashboard" style={linkStyle}>Dashboard</Link>
        
        </>
      )}

      {user && (
        <>
          <Link to="/playlists" style={linkStyle}>Playlists</Link>
          <Link to="/downloads" style={linkStyle}>Downloads</Link>
          <Link to="/profile" style={linkStyle}>Profile</Link>
        </>
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!user && (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}

        {user && (
          <>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {user.name} <span style={{ color: 'var(--accent)' }}>· {user.role}</span>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;