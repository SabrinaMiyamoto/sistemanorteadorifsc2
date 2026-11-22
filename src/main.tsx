import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import './index.css';

// Tema escuro com as cores neon do Sistema Norteador
const tema = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00f5ff' },
    secondary: { main: '#ff00ff' },
    success: { main: '#00ff88' },
    background: { default: '#0a0a0a', paper: '#14182b' },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={tema}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
