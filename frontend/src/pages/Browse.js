// src/pages/Browse.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { getPredefinedCatalogTypes, getPredefinedCatalogs } from '../api/browse';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { api } from '../api/auth';
import HorizontalScroll from '../components/HorizontalScroll';
import { RecipeCard } from '../components/RecipeCard';

export default function Browse() {
  const [types, setTypes] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [typeRes, catRes, favRes, recRes] = await Promise.all([
        getPredefinedCatalogTypes(),
        getPredefinedCatalogs(),
        api.get('favorites/'),
        api.get('recent/')
      ]);
      console.log("typeRes.data =", typeRes.data);
      setTypes(typeRes.data.results);
      setCatalogs(catRes.data.results);

    const sample = (arr, k) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) { //
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.slice(0, k);
    };
            /* ---- build personalised query ---- */
      const names = [
        ...(favRes.data.results || favRes.data).map(r => r.name),
        ...(recRes.data.results || recRes.data).map(r => r.name)
      ]
      const unique = [...new Set(names)];
      const picked = sample(unique, 8);
      if (picked.length) {
        const q = picked
          .join(' ')                                 // one big string
          .split(/\s+/)                              // tokens
          .filter(w => w.length > 2)                 // skip >2‑char words
          .slice(0, 5)                               // max 5 tokens
          .join(' ');

        const searchRes = await api.get('search/', {
          params: { q, limit: 10 }
        });
        setRecommended(searchRes.data.results || []);
      } else {
        setRecommended([]);
      }
    };
    fetchData();
  }, []);

  const getCatalogsForType = (typeId) => {
    return catalogs.filter(c => c.type === typeId);
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
             {/* ---------- personalised recommendations ---------- */}
        {recommended.length > 0 && (
          <>
            <Typography variant="h5" gutterBottom>
              Recommended recipes
            </Typography>
            <HorizontalScroll>
              {recommended.map(r => (
                <RecipeCard key={r.recipe_id} recipe={r} />
              ))}
            </HorizontalScroll>
            <Box sx={{ my: 4 }} /> {/* spacer */}
          </>
        )}

        <Typography variant="h4" gutterBottom>Browse Recipes</Typography>

        {types.map(type => (
          <Box key={type.id} sx={{ mb: 5 }}>
            <Typography variant="h5" gutterBottom>{type.name}</Typography>
            <Grid container spacing={3}>
              {getCatalogsForType(type.id).map(cat => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
                  <Card
                    sx={{ cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6 } }}
                    onClick={() => navigate(`/browse-catalog/${cat.id}`)}
                  >
                    <CardContent>
                      <Typography variant="h6">{cat.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
    </>
  );
}
