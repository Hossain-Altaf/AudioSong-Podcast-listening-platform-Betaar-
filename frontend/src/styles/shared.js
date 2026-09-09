export const card = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
};

export const mediaCard = {
  ...card,
  padding: '0.85rem',
  width: '170px',
  transition: 'transform 0.15s ease, border-color 0.15s ease',
};

export const pageWrap = {
  padding: '2rem',
  maxWidth: '1100px',
  margin: '0 auto',
};

export const eyebrow = {
  color: 'var(--accent)',
  fontSize: '0.78rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  margin: 0,
};

export const primaryButton = {
  background: 'var(--accent)',
  color: '#121212',
  fontWeight: 600,
  width: '100%',
};

export const grid = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.25rem',
};

export const fieldStyle = { marginBottom: '1.1rem' };
export const labelStyle = { fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: '0.3rem' };
export const inputStyle = { width: '100%' };