// src/pages/Browse.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
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

  const getCatalogEmoji = (name = '') => {
    const n = name.trim().toLowerCase();
  
    if (n.includes('breakfast'))              return '🍳';
    if (n.includes('dessert'))                return '🍰';
    if (n.includes('lunch') || n.includes('snack'))
                                             return '🥪';
    if (n.includes('beverage'))               return '🥤';
    if (n.includes('< 15'))                   return '⏱️';
    if (n.includes('< 30'))                   return '⏳';
    if (n.includes('< 60'))                   return '⌛';
    return '🍽️';                             // fallback
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [typeRes, catRes, favRes, recRes] = await Promise.all([
        getPredefinedCatalogTypes(),
        getPredefinedCatalogs(),
        api.get("favorites/"),
        api.get("recent/"),
      ]);

      setTypes(typeRes.data.results || []);
      setCatalogs(catRes.data.results || []);

      /* ---- build personalised query ---- */
      const names = [
        ...(favRes.data.results || favRes.data).map(r => r.name),
        ...(recRes.data.results || recRes.data).map(r => r.name),
      ];
      const unique = [...new Set(names)];

      const sample = (arr, k) => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, k);
      };

      const picked = sample(unique, 8);

      if (picked.length) {
        const q = picked
          .join(" ")
          .split(/\s+/)
          .filter(w => w.length > 2)
          .slice(0, 5)
          .join(" ");

        const searchRes = await api.get("search/", { params: { q, limit: 10 } });
        setRecommended(searchRes.data.results || []);
      } else {
        setRecommended([]);
      }
    } catch (err) {
      console.error("Failed to fetch browse data:", err);
      setTypes([]);
      setCatalogs([]);
      setRecommended([]);
    }
  };

  fetchData();
}, []);


  const getCatalogsForType = (typeId) => {
    return Array.isArray(catalogs) ? catalogs.filter(c => c.type === typeId) : [];
  };

return (
  <>
    <NavBar />

    {/* Apply the transparent style directly to the Container */}
    <Container 
      maxWidth="lg" 
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // White with 85% opacity
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px', // Add margin top
        marginBottom: '20px' // Add margin bottom
        // The existing mt: 4 and mb: 4 are replaced by marginTop/marginBottom
      }}
    >
      {/* page title */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: "center", mb: 5 }}
      >
        Browse Recipes
      </Typography>

      {/* ---------- personalised recommendations ---------- */}
      {recommended.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom>
            Recommended recipes
          </Typography>

          <HorizontalScroll>
            {recommended.map(r => (
              <RecipeCard key={r.recipe_id ?? r.id} recipe={r} />
            ))}
          </HorizontalScroll>

          <Box sx={{ my: 4 }} /> {/* spacer */}
        </>
      )}

      {/* ---------- catalog types ---------- */}
      {types.map(type => (
        <Box key={type.id} sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {type.name}
          </Typography>

          <Grid container spacing={4} sx={{ justifyContent: 'flex-start' }}>
  {getCatalogsForType(type.id).map((cat) => (
    <Grid key={cat.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
      <Box
        onClick={() => navigate(`/browse-catalog/${cat.id}`)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover .cat-icon': { boxShadow: 3, transform: 'scale(1.05)' },
          '&:hover .cat-name': { color: 'primary.main' },
        }}
      >
        {/* icon circle */}
        <Box
          className="cat-icon"
          sx={{
            width: 120,
            height: 120,
            mb: 1.5,
            borderRadius: '50%',
            bgcolor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            transition: 'transform .2s, box-shadow .2s',
          }}
        >
          {getCatalogEmoji(cat.name)}
        </Box>

        {/* label */}
        <Typography
          className="cat-name"
          variant="body1"
          fontWeight="medium"
        >
          {cat.name}
        </Typography>
      </Box>
    </Grid>
  ))}
</Grid>
        </Box>
      ))}
    </Container>
  </>
);

}
