import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63', // Pink
      light: '#f8bbd0',
      dark: '#c2185b',
      contrastText: '#fff',
    },
    secondary: {
      main: '#4caf50', // Green
      light: '#a5d6a7',
      dark: '#388e3c',
      contrastText: '#fff',
    },
    background: {
      default: '#fdfbf7', // Warm off-white
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.5rem', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

export default theme;
