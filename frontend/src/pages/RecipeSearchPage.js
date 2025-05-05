// src/pages/RecipeSearchPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Button, CircularProgress, Box, Paper } from '@mui/material';
import { api } from '../api/auth';
import { NavBar } from '../components/NavBar';
import { RecipeCard } from '../components/RecipeCard';

export default function RecipeSearchPage() {
  const { predefined_id } = useParams();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [catalogName, setCatalogName] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCatalogRecipes();
  }, [predefined_id]);

  const fetchCatalogRecipes = async (url = null) => {
    try {
      setLoading(true);
      const catalogRes = await api.get(`predefined-catalogs/${predefined_id}/`);
      setCatalogName(catalogRes.data.name);

      const filters = catalogRes.data.filter_criteria || {};
      const endpoint = url || 'recipes/';
      const res = await api.get(endpoint, { params: filters });
      console.log(res);
      setRecipes(res.data.results || res.data);
      setNextPageUrl(res.data.next);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (nextPageUrl) {
      const relativeUrl = nextPageUrl.replace('http://localhost:8000/api/', '');
      await fetchCatalogRecipes(relativeUrl);
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>← Back to Browse</Button>
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
          {catalogName || 'Recipes'}
        </Typography>

        <Grid container spacing={3}>
          {recipes.map(r => (
            <Grid item xs={12} sm={6} md={4} key={r.recipe_id}>
              <RecipeCard recipe={r} />
            </Grid>
          ))}
        </Grid>

        {loading && <CircularProgress sx={{ display: 'block', m: 'auto', mt: 4 }} />}

        {nextPageUrl && (
          <Button
            variant="contained"
            sx={{ mt: 4, display: 'block', mx: 'auto' }}
            onClick={loadMore}
          >
            Load More
          </Button>
        )}
      </Container>
    </>
  );
}
