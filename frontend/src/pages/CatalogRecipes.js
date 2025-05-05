import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Button, CircularProgress, Box } from '@mui/material';
import { api } from '../api/auth';      // using api instance we already made
import { RecipeCard } from '../components/RecipeCard';
import { NavBar } from '../components/NavBar';

export default function CatalogRecipes() {
  const { catalog_id } = useParams();
  const [catalog, setCatalog] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await api.get(`catalogs/${catalog_id}/`);
        setCatalog(res.data);
      } catch (error) {
        console.error("Error fetching catalog:", error);
        setCatalog(null); // Clear catalog data on error
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [catalog_id]);

  if (loading) return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      </Container>
    </>
  );

  if (!catalog) return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => navigate(-1)}>← Back to Browse</Button>
        <Typography variant="h4" gutterBottom sx={{ mt: 2, textAlign: 'center' }}>Catalog Not Found</Typography>
      </Container>
    </>
  );

  return (
    <>
      <NavBar />
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        <Button variant="contained" onClick={() => navigate(-1)}>← Back</Button>
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
