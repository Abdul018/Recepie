// src/pages/Browse.js
import React, { useEffect, useState } from 'react';
// Updated imports: Added Box, Avatar, removed Card/CardContent
import { Container, Typography, Grid, Box, Avatar } from '@mui/material';
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
    const fetchData = async () => 
      try { // Added try...catch for better error handling
        const [typeRes, catRes] = await Promise.all([
          getPredefinedCatalogTypes(),
          getPredefinedCatalogs()
        ]);
        console.log("typeRes.data =", typeRes.data);
        // Ensure results are arrays even if API returns null/undefined
        setTypes(typeRes.data.results || []);
        setCatalogs(catRes.data.results || []);
      } catch (error) {
        console.error("Failed to fetch browse data:", error);
        setTypes([]);
        setCatalogs([]);
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
    // Ensure catalogs is always an array before filtering
    return Array.isArray(catalogs) ? catalogs.filter(c => c.type === typeId) : [];
  };

  return (
    <>
      <NavBar />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> {/* Added mb */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 5 }}> {/* Centered title */}
          Browse Recipes
        </Typography>
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
            {/* Keep Type Name as heading */}
            <Typography variant="h5" component="h2" gutterBottom>{type.name}</Typography>
            {/* Grid for catalogs of this type */}
            <Grid container spacing={4} justifyContent="flex-start"> {/* Adjust spacing/justification */}
              {getCatalogsForType(type.id).map(cat => (
                 // Adjust grid sizing for desired number of circular elements per row
                <Grid item key={cat.id} xs={6} sm={4} md={3} lg={2}>
                   {/* Replace Card with Box, Avatar, Typography structure */}
                   <Box
                      onClick={() => navigate(`/browse-catalog/${cat.id}`)} // Keep navigation
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { // Add subtle hover effect
                          '& .MuiAvatar-root': {
                            boxShadow: 3,
                            transform: 'scale(1.05)'
                          },
                          '& .MuiTypography-root': {
                            color: 'primary.main'
                          }
                        }
                      }}
                   >
                      {/* Circular Avatar for the catalog */}
                      <Avatar
                         // TODO: Replace src with cat.image if available
                         // src={cat.image || undefined}
                         sx={{
                            width: 120, // Larger size
                            height: 120,
                            mb: 1.5,
                            bgcolor: 'grey.200', // Lighter placeholder background
                            fontSize: '4rem', // Larger Icon size
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
                          }}
                      >
                          {/* Replace Icon with Emoticons */}
                          🍔 {/* Burger, Coke, Fries */}
                      </Avatar>
                      {/* Catalog Name */}
                      <Typography variant="body1" fontWeight="medium">
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
