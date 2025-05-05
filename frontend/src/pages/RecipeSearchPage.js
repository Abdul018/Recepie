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
    setRecipes([]); // Clear recipes when ID changes
    setLoading(true);
    fetchCatalogRecipes();
  }, [predefined_id]);

  const fetchCatalogRecipes = async (url = null) => {
    try {
      // setLoading(true); // Loading is set in useEffect and loadMore
      const catalogRes = await api.get(`predefined-catalogs/${predefined_id}/`);
      setCatalogName(catalogRes.data.name);

      const filters = catalogRes.data.filter_criteria || {};
      const endpoint = url || 'recipes/';
      const res = await api.get(endpoint, { params: filters });
      
      if (url) { // Append if loading more
        setRecipes(prev => [...prev, ...(res.data.results || res.data)]);
      } else { // Replace if initial load
        setRecipes(res.data.results || res.data || []);
      }
      setNextPageUrl(res.data.next);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setRecipes([]); // Clear on error
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (nextPageUrl && !loading) { // Prevent multiple loads
      setLoading(true);
      // Extract relative path correctly, handling potential initial /
      try {
        const urlObject = new URL(nextPageUrl); 
        const relativeUrl = urlObject.pathname.substring(1) + urlObject.search + urlObject.hash;
        await fetchCatalogRecipes(relativeUrl.replace('api/','')); // Ensure api/ prefix is removed
      } catch (e) {
         console.error("Invalid nextPageUrl:", nextPageUrl, e);
         setLoading(false);
      } 
    }
  };

  return (
    <>
      <NavBar />
      {/* Apply the transparent style directly to the Container */}
      <Container 
        maxWidth="lg" 
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          marginBottom: '20px'
        }}
      >
        <Button variant="contained" onClick={() => navigate(-1)}>← Back</Button>
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
          {catalogName || (loading ? 'Loading...' : 'Recipes')}
        </Typography>

        <Grid container spacing={3}>
          {recipes.map(r => (
            <Grid item xs={12} sm={6} md={4} key={r.recipe_id ?? r.id}> {/* Use recipe_id or fallback to id */}
              <RecipeCard recipe={r} />
            </Grid>
          ))}
        </Grid>

        {/* Only show loader when actively loading */}
        {loading && <CircularProgress sx={{ display: 'block', m: 'auto', mt: 4 }} />}

        {/* Only show Load More if not currently loading and there is a next page */}
        {nextPageUrl && !loading && (
          <Button
            variant="contained"
            sx={{ mt: 4, display: 'block', mx: 'auto' }}
            onClick={loadMore}
            disabled={loading} // Disable button while loading
          >
            Load More
          </Button>
        )}
        
        {/* Indicate if no recipes found and not loading */}
        {!loading && recipes.length === 0 && (
            <Typography sx={{textAlign: 'center', mt: 4}}>No recipes found in this catalog.</Typography>
        )}

      </Container>
    </>
  );
}
