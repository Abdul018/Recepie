// src/pages/Favorites.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button } from '@mui/material';
import { api } from '../api/auth';
import { NavBar } from '../components/NavBar';
import { RecipeCard } from '../components/RecipeCard';
import { useNavigate } from 'react-router-dom';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await api.get('favorites/');  // maybe you want pagination later
      setFavorites(res.data.results || res.data);
    })();
  }, []);

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>← Back</Button>
        <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>All Favorites</Typography>

        <Grid container spacing={3}>
          {favorites.length === 0 ? (
            <Typography>No favorites yet</Typography>
          ) : (
            favorites.map(r => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={r.recipe_id}>
                <RecipeCard recipe={r} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </>
  );
}
