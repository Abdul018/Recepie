
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Button } from '@mui/material';
import { api } from '../api/auth';      // using api instance we already made
import { RecipeCard } from '../components/RecipeCard';
import { NavBar } from '../components/NavBar';

export default function CatalogRecipes() {
  const { catalog_id } = useParams();
  const [catalog, setCatalog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCatalog = async () => {
      const res = await api.get(`catalogs/${catalog_id}/`);
      setCatalog(res.data);
    };
    fetchCatalog();
  }, [catalog_id]);

  if (!catalog) return <div>Loading...</div>;

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>← Back to Browse</Button>
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>{catalog.name}</Typography>

        <Grid container spacing={3}>
          {catalog.recipes.map(r => (
            <Grid item xs={12} sm={6} md={4} key={r.recipe_id}>
              <RecipeCard recipe={r} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
