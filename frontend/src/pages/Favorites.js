// src/pages/Favorites.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { api } from '../api/auth';
import { NavBar } from '../components/NavBar';
import { RecipeCard } from '../components/RecipeCard';
import { useNavigate } from 'react-router-dom';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const res = await api.get('favorites/');         // adjust endpoint if needed
        setFavorites(res.data.results || res.data || []);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <NavBar />

      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: 'rgba(255,255,255,0.85)',
          p: 3,
          borderRadius: 2,
          mt: 3,
          mb: 3,
        }}
      >
        <Button variant="contained" onClick={() => navigate(-1)}>
          ← Back
        </Button>

        <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
          All Favorites
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : favorites.length === 0 ? (
          <Typography>No favorites yet</Typography>
        ) : (
          <Grid container spacing={3}>
            {favorites.map((r) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={r.recipe_id}>
                <RecipeCard recipe={r} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
