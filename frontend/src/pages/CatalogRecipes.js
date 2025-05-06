// src/pages/CatalogRecipes.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Grid, Button,
  CircularProgress, Box
} from '@mui/material';
import { api } from '../api/auth';
import { RecipeCard } from '../components/RecipeCard';
import { NavBar } from '../components/NavBar';

export default function CatalogRecipes() {
  const { catalog_id } = useParams();           // /browse-catalog/:catalog_id
  const navigate      = useNavigate();

  const [catalog, setCatalog] = useState(null); // { id, name, is_owner, recipes:[] }
  const [loading, setLoading] = useState(true);

  /* ---------- fetch once ---------- */
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await api.get(`catalogs/${catalog_id}/`);
        setCatalog(res.data);
      } catch (err) {
        console.error(err);
        setCatalog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [catalog_id]);

  /* ---------- delete handler ---------- */
  const handleRemove = async (recipe) => {
    try {
      await api.delete(
        `catalogs/${catalog_id}/remove-recipe/${recipe.recipe_id}/`
      );
      // update local state
      setCatalog(prev => ({
        ...prev,
        recipes: prev.recipes.filter(r => r.recipe_id !== recipe.recipe_id)
      }));
    } catch {
      alert('Could not remove recipe');
    }
  };

  /* ---------- loading / error states ---------- */
  if (loading) return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      </Container>
    </>
  );

  if (!catalog) return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => navigate(-1)}>
          ← Back to Browse
        </Button>
        <Typography variant="h4" sx={{ mt: 3 }} align="center">
          Catalog not found
        </Typography>
      </Container>
    </>
  );

  /* ---------- main render ---------- */
  const { is_owner, recipes } = catalog;

  return (
    <>
      <NavBar />
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: 'rgba(255,255,255,0.85)',
          p: 3,
          borderRadius: 2,
          mt: 3, mb: 3
        }}
      >
        <Button variant="outlined" onClick={() => navigate(-1)}>← Back</Button>
        <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>{catalog.name}</Typography>

        {recipes.length === 0 ? (
          <Typography>No recipes in this catalog yet.</Typography>
        ) : (
          <Grid container spacing={3}>
            {recipes.map(r => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={r.recipe_id}>
                <RecipeCard
                  recipe={r}
                  onClick={() => navigate(`/recipe/${r.recipe_id}`)}
                  onRemove={is_owner ? handleRemove : undefined}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
