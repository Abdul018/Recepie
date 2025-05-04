import React, { useContext } from 'react';
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
/* ─────────────────────────────── */
/*  Small helper for protected UI  */
/* ─────────────────────────────── */
function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public unified auth page */}
          <Route path="/auth" element={<AuthPage />} />

          <Route path="/search" element={<SearchPage />} />


          {/* Protected home page */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          {/* Catch-all → auth */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
          <Route path="/browse" element={<PrivateRoute> <Browse />
                 </PrivateRoute>
                    }
            />
          <Route path="/recipe/:recipe_id" element={<PrivateRoute><RecipeDetail /></PrivateRoute>} />

          <Route path="/catalog/:catalog_id" element={<PrivateRoute><CatalogRecipes /></PrivateRoute>} />
            <Route
    path="/browse-catalog/:predefined_id"
    element={
      <PrivateRoute>
        <RecipeSearchPage />
      </PrivateRoute>
    }
  />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
        </Routes>



      </BrowserRouter>
    </AuthProvider>
  );
}
