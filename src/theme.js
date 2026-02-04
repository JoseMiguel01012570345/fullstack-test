import { createTheme } from '@mui/material/styles';

// Tema ejecutivo: azules y grises corporativos
const theme = createTheme({
  palette: {
    primary: {  
      main: '#0d47a1',
      light: '#fff',
      dark: '#fff',
    },
    secondary: {
      main: '#0d47a1',
      light: '#fff',
      dark: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#f0f0f0',
          color: 'gray',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        },
      },
    },
  },
});

export default theme;
