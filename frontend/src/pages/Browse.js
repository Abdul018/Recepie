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
  const [types, setTypes]   = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const navigate = useNavigate();

  /* ---------- helpers ---------- */
  const getCatalogEmoji = (name = '') => {
    const n = name.trim().toLowerCase();
    if (n.includes('breakfast'))              return '🍳';
    if (n.includes('dessert'))                return '🍰';
    if (n.includes('lunch') || n.includes('snack')) return '🥪';
    if (n.includes('beverage'))               return '🥤';
    if (n.includes('< 15'))                   return '⏱️';
    if (n.includes('< 30'))                   return '⏳';
    if (n.includes('< 60'))                   return '⌛';
    return '🍽️';
  };

  const getCatalogsForType = (typeId) =>
    Array.isArray(catalogs) ? catalogs.filter(c => c.type === typeId) : [];

  /* ---------- data fetch ---------- */
  useEffect(() => {
    (async () => {
      try {
        const [typeRes, catRes, favRes, recRes] = await Promise.all([
          getPredefinedCatalogTypes(),
          getPredefinedCatalogs(),
          api.get('favorites/'),
          api.get('recent/')
        ]);

        setTypes(typeRes.data.results || []);
        setCatalogs(catRes.data.results || []);

        /* ---- personalised recommendations ---- */
        const names = [
          ...(favRes.data.results || favRes.data).map(r => r.name),
          ...(recRes.data.results || recRes.data).map(r => r.name)
        ];

        const unique = [...new Set(names)];
        const sample = (arr, k) =>
          [...arr]
            .sort(() => 0.5 - Math.random())     // shuffle
            .slice(0, k);

        const picked = sample(unique, 8);
        if (!picked.length) return setRecommended([]);

        const q = picked
          .join(' ')
          .split(/\s+/)
          .filter(w => w.length > 2)
          .slice(0, 5)
          .join(' ');

        const searchRes = await api.get('search/', { params: { q, limit: 10 } });
        setRecommended(searchRes.data.results || []);
      } catch (err) {
        console.error('Failed to fetch browse data:', err);
        setTypes([]); setCatalogs([]); setRecommended([]);
      }
    })();
  }, []);

  /* ---------- render ---------- */
  return (
    <>
      <NavBar />

      {/*   offset for fixed NavBar so headers don’t overlap   */}
       <Container
        maxWidth="lg"
                sx={{
          mt: { xs: 10, sm: 12 },       // pushes below fixed AppBar
          pt: 5,
          pb: 8,
          px: { xs: 2, md: 4 },
          bgcolor: 'transparent'       // <- kill that flat grey slab
        }}
      >
        <Typography variant="h4" textAlign="center" mb={5}>
          Browse Recipes
        </Typography>

        {/* personalised section */}
            {!!recommended.length && (
           <Box
             sx={{
               mb: 6,
               px: 3,
               py: 4,
               borderRadius: 3,
               bgcolor: 'rgba(255,255,255,0.1)', // subtle glassy overlay
               backdropFilter: 'blur(6px)'
             }}
           >
             <Typography variant="h5" gutterBottom color="white">
               Recommended recipes
             </Typography>

             {/* horizontally scrollable strip */}
             <Box
               component="div"
               sx={{
                 display: 'flex',
                 gap: 3,
                 overflowX: 'auto',
                 pb: 1
               }}
             >
               {recommended.map(r => (
                 <RecipeCard
                   key={r.recipe_id ?? r.id}
                   recipe={r}
                   sx={{ minWidth: 260 }}   // keep card inside the strip
                 />
               ))}
             </Box>
           </Box>
         )}

        {/* catalog types */}
        {types.map(type => (
          <Box key={type.id} mb={6}>
            <Typography variant="h5" gutterBottom>{type.name}</Typography>

            <Grid container spacing={4}>
              {getCatalogsForType(type.id).map(cat => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={cat.id}>
                  <Box
                    onClick={() => navigate(`/browse-catalog/${cat.id}`)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover .cat-icon': { boxShadow: 3, transform: 'scale(1.05)' },
                      '&:hover .cat-name': { color: 'primary.main' }
                    }}
                  >
                    {/* icon */}
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
                        transition: 'transform .2s, box-shadow .2s'
                      }}
                    >
                      {getCatalogEmoji(cat.name)}
                    </Box>

                    {/* label */}
                    <Typography className="cat-name" fontWeight={500}>
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
