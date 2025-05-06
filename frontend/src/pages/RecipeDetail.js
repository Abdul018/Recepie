// src/pages/RecipeDetail.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Grid, Paper, Button, Chip, Box, CircularProgress,
  IconButton, Menu, MenuItem, ListItemText, Divider, TextField
} from '@mui/material';
import { Favorite, FavoriteBorder, Add } from '@mui/icons-material';
import { api } from '../api/auth';
import { NavBar } from '../components/NavBar';
import HorizontalScroll from '../components/HorizontalScroll';
import { RecipeCard } from '../components/RecipeCard';

const DEFAULT_IMAGE_URL =
  'https://placehold.co/600x400/E8E8E8/BDBDBD?text=No+Image';

export default function RecipeDetail() {
  const { recipe_id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [isFav, setIsFav]           = useState(false);
  const [anchorEl, setAnchorEl]     = useState(null);
  const [catalogs, setCatalogs]     = useState([]);
  const [newName,  setNewName]      = useState('');
  const [similar,  setSimilar]      = useState([]);

  const menuOpen = Boolean(anchorEl);
  const inputRef = useRef(null);

  /* ---------- helper: fetch similar ---------- */
  const fetchSimilar = async (rec) => {
    if (!rec?.name) return [];
    const tokens = rec.name
      .split(/\s+/)
      .map(w => w.replace(/[^\w]/g, '').toLowerCase())
      .filter(w => w.length > 2);

    const all  = [];
    const seen = new Set([String(rec.recipe_id)]);

    for (const tok of tokens) {
      try {
        const res = await api.get('search/', {
          params: { q: tok, exclude: rec.recipe_id, limit: 3 }
        });

        for (const r of res.data.results || []) {
          const key = String(r.recipe_id || r.id);
          if (!seen.has(key)) {
            seen.add(key);
            all.push(r);
            if (all.length >= 10) break;
          }
        }
      } catch {}
      if (all.length >= 10) break;
    }
    return all;
  };

  /* ---------- initial fetch ---------- */
  useEffect(() => {
    if (!recipe_id) return;

    setLoading(true);
    setRecipe(null);
    setSimilar([]);

    (async () => {
      try {
        const res = await api.get(`recipes/${recipe_id}/`);
        setRecipe(res.data);
        console.log(res.data)
        setIsFav(res.data.is_favorite);
        fetchSimilar(res.data).then(setSimilar);
      } finally {
        setLoading(false);
      }
    })();
  }, [recipe_id]);

  /* ---------- favourite toggle ---------- */
  const toggleFav = async () => {
    if (!recipe) return;
    try {
      if (isFav) {
        await api.delete(`favorites/${recipe_id}/`);
        setIsFav(false);
      } else {
        await api.post('favorites/', { recipe_id });
        setIsFav(true);
      }
    } catch { alert('Could not update favourite'); }
  };

  /* ---------- catalog helpers ---------- */
  const fetchCatalogs = async () => {
    const res = await api.get('catalogs/');
    setCatalogs(res.data.results || res.data || []);
  };

  const handleMenuOpen  = (e) => { setAnchorEl(e.currentTarget); fetchCatalogs(); };
  const handleMenuClose = () => { setAnchorEl(null); setNewName(''); };

  const addToCatalog = async (id) => {
    await api.post(`catalogs/${id}/add-recipe/`, { recipe_id });
    alert('Added to catalog');
    handleMenuClose();
  };

  const createAndAdd = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const res = await api.post('catalogs/', { name: trimmed });
    await addToCatalog(res.data.id);
  };

  /* ---------- loading / error ---------- */
  if (loading) return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ mt: 6 }} />
      </Container>
    </>
  );
  if (!recipe) return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => navigate(-1)}>← Back</Button>
        <Typography align="center" sx={{ mt: 6 }}>Recipe not found</Typography>
      </Container>
    </>
  );

  /* ---------- derived values ---------- */
  const imageUrl = recipe.images?.[0] || DEFAULT_IMAGE_URL;
  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions;

  /* ---------- UI ---------- */
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
        <Button variant="contained" onClick={() => navigate(-1)}>← Back</Button>

        {/* ---- header: image + info ---- */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* image */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={3}
              sx={{ overflow: 'hidden', borderRadius: 2, maxHeight: { xs: 180, sm: 220, md: 260 } }}
            >
              <img
                src={imageUrl}
                alt={recipe.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Paper>
          </Grid>

          {/* info / buttons */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: { xs: 2, md: 0 } }}>
              {recipe.name}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
              {recipe.calories   && <Chip label={`${recipe.calories} Cal`}  variant="outlined" />}
              {recipe.total_mins && <Chip label={`${recipe.total_mins} mins`} variant="outlined" />}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <IconButton
                color="error"
                onClick={toggleFav}
                sx={{ border: '1px solid #ccc', backgroundColor: '#fff' }}
              >
                {isFav ? <Favorite /> : <FavoriteBorder />}
              </IconButton>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleMenuOpen}
              >
                Add to Catalog
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* ---- body: ingredients & instructions ---- */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {/* ingredients */}
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Ingredients
              </Typography>
              {ingredients.length ? (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {ingredients.map((ing, idx) => {
                    const name = typeof ing.name === 'string'
                      ? ing.name.charAt(0).toUpperCase() + ing.name.slice(1)
                      : ing.name;
                    return (
                      <li key={idx}>{name}{ing.quantity ? ` – ${ing.quantity}` : ''}</li>
                    );
                  })}
                </ul>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No ingredients listed.
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* instructions */}
          <Grid item xs={12} md={8}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Instructions
              </Typography>

        {(() => {
               // 1. normalise into an array if possible
               let steps = instructions;
               if (typeof instructions === 'string' && instructions.trim().startsWith('[')) {
                 try { steps = JSON.parse(instructions); } catch { /* keep as string */ }
               }

               // 2. render array vs. plain string
               if (Array.isArray(steps)) {
                 return (
                   <ol style={{ paddingLeft: 20 }}>
                     {steps.map((s, i) => (
                       <li key={i} style={{ marginBottom: 8 }}>{s}</li>
                     ))}
                   </ol>
                 );
               }
               return (
                 <Typography sx={{ whiteSpace: 'pre-line' }}>
                   {steps || 'No instructions provided.'}
                 </Typography>
               );
             })()}
            </Paper>
          </Grid>
        </Grid>

        {/* ---- recommended ribbon ---- */}
        {similar.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Recommended Recipes
            </Typography>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <HorizontalScroll>
                {similar.map(r => (
                  <RecipeCard key={r.recipe_id ?? r.id} recipe={r} />
                ))}
              </HorizontalScroll>
            </Paper>
          </Box>
        )}
      </Container>

      {/* ---- catalog dropdown ---- */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        disableAutoFocusItem
      >
        <Box sx={{ px: 2, py: 1.5, width: 260 }}>
          <Typography variant="subtitle2" gutterBottom>New Catalog</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Catalog name"
            autoFocus
            inputRef={inputRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createAndAdd()}
          />
          <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={createAndAdd}>
            Create & Add
          </Button>
        </Box>
        <Divider />
        {catalogs.length === 0 ? (
          <MenuItem disabled>
            <ListItemText>No catalogs yet</ListItemText>
          </MenuItem>
        ) : (
          catalogs.map((cat) => (
            <MenuItem key={cat.id} onClick={() => addToCatalog(cat.id)}>
              <ListItemText>{cat.name}</ListItemText>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
