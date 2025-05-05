// src/App.js
import React, { useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CatalogRecipes from './pages/CatalogRecipes';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { AuthPage } from "./components/AuthPage.js";
import Home from './pages/Home';
import Browse from "./pages/Browse";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeSearchPage from './pages/RecipeSearchPage';
import Favorites from './pages/Favorites';
import SearchPage from './pages/SearchPage' ;

// Define the theme with the background image
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6347',
    },
    secondary: {
      main: '#FFDAB9',
    },
    background: {
      default: '#f0f0f0', // Set a default background color if the image fails to load
      paper: '#FFFFFF', // Keep paper white for contrast
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url("https://img.freepik.com/premium-photo/ingredients-cooking-food-background-with-herbs-vegetables-top-view-white-background_1040174-1580.jpg?semt=ais_hybrid&w=740")`,
          backgroundRepeat: 'repeat', // You can change to 'no-repeat', 'repeat-x', 'repeat-y'
          backgroundSize: 'cover',     // Or use 'contain' to fit the image within the viewport
          backgroundAttachment: 'fixed', // Keep the background fixed during scroll
        },
      },
    },
  },
});

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return user ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* CssBaseline MUST be inside ThemeProvider */}
        <BrowserRouter>
          <Routes>
            {/* Public unified auth page */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/search" element={<SearchPage />} />

            {/* Protected home page */}
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/browse" element={<PrivateRoute><Browse /></PrivateRoute>} />
            <Route path="/recipe/:recipe_id" element={<PrivateRoute><RecipeDetail /></PrivateRoute>} />
            <Route path="/catalog/:catalog_id" element={<PrivateRoute><CatalogRecipes /></PrivateRoute>} />
            <Route path="/browse-catalog/:predefined_id" element={<PrivateRoute><RecipeSearchPage /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
