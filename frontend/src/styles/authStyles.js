const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg,#fff 0%,#ffe4d9 100%)',
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  title: {
    marginBottom: '40px',
    fontSize: '48px',
    color: '#ff7043',
    fontWeight: 700,
    letterSpacing: '1px',
  },
  flexRow: {
    display: 'flex',
    gap: '60px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    padding: '40px 32px',
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '24px',
  },
  input: {
    marginBottom: '16px',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '15px',
  },
  button: {
    padding: '12px',
    background: '#ff7043',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

export default styles;