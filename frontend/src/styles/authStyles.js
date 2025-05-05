const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f0f0',
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  title: {
    marginBottom: '40px',
    fontSize: '48px',
    color: '#ff6347',
    fontWeight: '700',
    letterSpacing: '1px',
  },
  flexRow: {
    display: 'flex',
    gap: '60px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    padding: '40px 32px',
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: '24px',
  },
  input: {
    marginBottom: '16px',
    padding: '12px',
    border: '1px solid #ff6347',
    borderRadius: '8px',
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