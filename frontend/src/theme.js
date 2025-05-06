import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f0f0f',
      paper: '#111111',
    },
    primary: {
      main: '#ff7d1a',
    },
    secondary: {
      main: '#ffa042',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    button: { textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            transform: 'scale(1.02)',
          },
          transition: 'transform 0.2s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          '&:hover': {
            transform: 'scale(1.03)',
          },
          transition: 'transform 0.25s ease-in-out',
        },
      },
    },
  },
});

export default theme;
