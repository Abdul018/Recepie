// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import CatalogRecipes from './pages/CatalogRecipes';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import Home from './pages/Home';
import Browse from './pages/Browse';
import RecipeDetail from './pages/RecipeDetail';
import RecipeSearchPage from './pages/RecipeSearchPage';
import Favorites from './pages/Favorites';
import SearchPage from './pages/SearchPage';

// ---------- THEME ----------
const theme = createTheme({
  palette: {
    primary: { main: '#FF6347' },
    secondary: { main: '#FFDAB9' },
    text: { primary: '#333', secondary: '#555' },
    background: { default: 'transparent' } // let the video shine through
  },
});

// ---------- VIDEO BACKGROUND WITH OVERLAY ----------
function BackgroundVideo() {
  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
          pointerEvents: 'none',
          filter: 'brightness(0.9) saturate(0.9)' // dim + tone down color
        }}
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // dark overlay
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
    </>
  );
}

// ---------- ROUTE GUARD ----------
function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null; // or a spinner
  return user ? children : <Navigate to="/auth" replace />;
}

// ---------- APP ----------
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BackgroundVideo />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/search" element={<SearchPage />} />

            {/* Protected routes */}
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/browse" element={<PrivateRoute><Browse /></PrivateRoute>} />
            <Route path="/recipe/:recipe_id" element={<PrivateRoute><RecipeDetail /></PrivateRoute>} />
            <Route path="/catalog/:catalog_id" element={<PrivateRoute><CatalogRecipes /></PrivateRoute>} />
            <Route path="/browse-catalog/:predefined_id" element={<PrivateRoute><RecipeSearchPage /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
