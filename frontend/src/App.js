import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Stock from './pages/Stock';
import Settings from './pages/Settings';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff6f3c', // Modern turuncu
      contrastText: '#fff',
    },
    secondary: {
      main: '#22223b', // Koyu mor-gri
      contrastText: '#fff',
    },
    background: {
      default: '#f8f9fa', // Açık gri arka plan
      paper: '#fff',
    },
    success: {
      main: '#43aa8b',
    },
    error: {
      main: '#f94144',
    },
    warning: {
      main: '#f9c74f',
    },
    info: {
      main: '#277da1',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 14, // Daha yuvarlak köşeler
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px) scale(1.03)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
