// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import { api } from '../api/auth';
import { NavBar } from '../components/NavBar';
import HorizontalScroll from '../components/HorizontalScroll';
import { RecipeCard } from '../components/RecipeCard';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [recent, setRecent] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const navigate = useNavigate();

   useEffect(() => {
      /* one tiny helper so we can call it on mount AND on focus */
      const fetchDashboardData = async () => {
        try {
          const [r, f, c] = await Promise.all([
            api.get('recent/'),
            api.get('favorites/'),
            api.get('catalogs/')
          ]);
          setRecent(r.data.results || r.data);
          setFavorites(f.data.results || f.data);
          setCatalogs(c.data.results || c.data);
        } catch (err) {
          console.error(err);
        }
      };

      /* first load */
      fetchDashboardData();

      /* refresh whenever the tab/window gains focus */
      const handleFocus = () => fetchDashboardData();
      window.addEventListener('focus', handleFocus);

      /* clean-up */
      return () => window.removeEventListener('focus', handleFocus);
    }, []);
  return (
    <>
      <NavBar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Recently Accessed */}
        <Typography variant="h5" gutterBottom>Recently Accessed</Typography>
        <HorizontalScroll>
          {recent.length === 0 ? (
            <Typography>No recent recipes</Typography>
          ) : (
            recent.map(r => (
              <RecipeCard key={r.recipe_id} recipe={r} />
            ))
          )}
        </HorizontalScroll>
        {/* Favourites */}
        <Typography variant="h5" sx={{ mt: 4 }} gutterBottom>
          Favourites
          <Button size="small" sx={{ ml: 2 }} onClick={() => navigate('/favorites')}>
            View More
          </Button>
        </Typography>
            <HorizontalScroll>
              {favorites.length === 0 ? (
                <Typography>No favorites yet</Typography>
              ) : (
                favorites.map(r => (
                  <RecipeCard key={r.recipe_id} recipe={r} />
                ))
              )}
            </HorizontalScroll>

        {/* User Catalogs */}
        <Typography variant="h5" sx={{ mt: 4 }} gutterBottom>
          Your Catalogs
        </Typography>
        <Grid container spacing={3}>
          {catalogs.length === 0 ? (
            <Typography>No catalogs created yet</Typography>
          ) : (
            catalogs.map(cat => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ height: 100 }}
                  onClick={() => navigate(`/catalog/${cat.id}`)}
                >
                  {cat.name}
                </Button>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </>
  );
}
