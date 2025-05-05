// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import { api } from '../api/auth';
import { NavBar } from '../components/NavBar';
import HorizontalScroll from '../components/HorizontalScroll';
import { RecipeCard } from '../components/RecipeCard';
import { CatalogCard } from '../components/CatalogCard';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [recent, setRecent] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const navigate = useNavigate();

   useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          const [r, f, c] = await Promise.all([
            api.get('recent/'),
            api.get('favorites/'),
            api.get('catalogs/')
          ]);
          setRecent(r.data.results || r.data || []);
          setFavorites(f.data.results || f.data || []);
          setCatalogs(c.data.results || c.data || []);
        } catch (err) {
          console.error(err);
          setRecent([]);
          setFavorites([]);
          setCatalogs([]);
        }
      };

      fetchDashboardData();
      const handleFocus = () => fetchDashboardData();
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }, []);

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
        }}
      >
        {/* Recently Accessed */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              display: 'inline-block',
              px: 2,
              py: 0.5,
              borderRadius: 1,
              mb: 1
            }}
          >
            <Typography variant="h5" component="h2">Recently Accessed</Typography>
          </Box>
          <HorizontalScroll>
            {recent.length === 0 ? (
              <Typography sx={{ ml: 1.5 }}>No recent recipes</Typography>
            ) : (
              recent.map(r => (
                <Box key={r.recipe_id ?? r.id} sx={{ width: 250, flexShrink: 0, mr: 2 }}>
                  <RecipeCard recipe={r} />
                </Box>
              ))
            )}
          </HorizontalScroll>
        </Box>
  
        {/* Favourites */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box
              sx={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                display: 'inline-block',
                px: 2,
                py: 0.5,
                borderRadius: 1
              }}
            >
              <Typography variant="h5" component="h2">Favourites</Typography>
            </Box>
            <Button size="small" onClick={() => navigate('/favorites')}>View All</Button>
          </Box>
          <HorizontalScroll>
            {favorites.length === 0 ? (
              <Typography sx={{ ml: 1.5 }}>No favorites yet</Typography>
            ) : (
              favorites.map(r => (
                <Box key={r.recipe_id ?? r.id} sx={{ width: 250, flexShrink: 0, mr: 2 }}>
                  <RecipeCard recipe={r} />
                </Box>
              ))
            )}
          </HorizontalScroll>
        </Box>
  
        {/* User Catalogs */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              display: 'inline-block',
              px: 2,
              py: 0.5,
              borderRadius: 1,
              mb: 1
            }}
          >
            <Typography variant="h5" component="h2">Your Catalogs</Typography>
          </Box>
          <HorizontalScroll>
            {catalogs.length === 0 ? (
              <Typography sx={{ ml: 1.5 }}>No catalogs created yet</Typography>
            ) : (
              catalogs.map(cat => (
                <Box key={cat.id} sx={{ width: 250, flexShrink: 0, mr: 2 }}>
                  <CatalogCard catalog={cat} onClick={() => navigate(`/catalog/${cat.id}`)} />
                </Box>
              ))
            )}
          </HorizontalScroll>
        </Box>
      </Container>
    </>
  );
}  