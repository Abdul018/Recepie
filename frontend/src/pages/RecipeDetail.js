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

export default function RecipeDetail() {
  const { recipe_id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [catalogs, setCatalogs] = useState([]);
  const [newName, setNewName] = useState('');
  const menuOpen = Boolean(anchorEl);
  const inputRef = useRef(null);
  const [similar, setSimilar] = useState([]);

  const fetchSimilar = async (rec) => {
    const tokens = rec.name
      .split(/\s+/)
      .map(w => w.replace(/[^\w]/g, '').toLowerCase())
      .filter(w => w.length > 2);

    const seen = new Set([String(rec.recipe_id)]);
    const all = [];

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

      } catch (err) {
        console.warn('similar fetch failed:', tok, err.message);
      }
      if (all.length >= 10) break;
    }
    return all;
  };

  useEffect(() => {
    if (!recipe_id) return;

    (async () => {
      try {
        const res = await api.get(`recipes/${recipe_id}/`);
        setRecipe(res.data);
        fetchSimilar(res.data).then(setSimilar);
        setIsFav(res.data.is_favorite);
      } finally {
        setLoading(false);
      }
    })();
  }, [recipe_id]);

  const toggleFav = async () => {
    try {
      if (isFav) {
        await api.delete(`favorites/${recipe_id}/`);
        setIsFav(false);
      } else {
        await api.post('favorites/', { recipe_id });
        setIsFav(true);
      }
    } catch {
      alert('Could not update favourite');
    }
  };

  const fetchCatalogs = async () => {
    const res = await api.get('catalogs/');
    setCatalogs(res.data.results || res.data);
  };

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
    fetchCatalogs();
  };

  useEffect(() => {
    if (anchorEl && inputRef.current) inputRef.current.focus();
  }, [anchorEl]);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNewName('');
  };

  const addToCatalog = async (id) => {
    try {
      await api.post(`catalogs/${id}/add-recipe/`, { recipe_id });
      alert('Added to catalog');
      handleMenuClose();
    } catch {
      alert('Failed to add');
    }
  };

  const createAndAdd = async () => {
    if (!newName.trim()) return;
    try {
      const res = await api.post('catalogs/', { name: newName.trim() });
      await addToCatalog(res.data.id);
      fetchCatalogs();
    } catch {
      alert('Could not create catalog');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 6 }} />;
  if (!recipe) return <Typography align="center" sx={{ mt: 6 }}>Recipe not found</Typography>;

  return (
    <>
      <NavBar />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>← Back</Button>

        <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2, mt: 3 }}>
          <Box
            component="img"
            src={recipe.images?.[0] || 'https://via.placeholder.com/600x400'}
            alt={recipe.name}
            sx={{
              width: '100%',
              height: { xs: 250, sm: 300, md: 400 },
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Paper>

        {/* Recipe Name & Controls */}
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: 'inline-block',
              px: 2,
              py: 1,
              borderRadius: 1,
              color: 'white'
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {recipe.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
            {recipe.calories && <Chip label={`${recipe.calories} Cal`} variant="outlined" />}
            {recipe.total_mins && <Chip label={`${recipe.total_mins} mins`} variant="outlined" />}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <IconButton
              color="error"
              onClick={toggleFav}
              sx={{
                border: '1px solid #ccc',
                backgroundColor: '#fff',
                '&:hover': { backgroundColor: '#fce4ec' }
              }}
            >
              {isFav ? <Favorite fontSize="medium" /> : <FavoriteBorder fontSize="medium" />}
            </IconButton>

            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleMenuOpen}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
                fontWeight: 'bold'
              }}
            >
              Add to Catalog
            </Button>
          </Box>
        </Box>

        {/* Ingredients & Instructions */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Ingredients
              </Typography>
              <ul style={{ marginLeft: 20, paddingLeft: 0 }}>
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    {ing.name}{ing.quantity ? ` – ${ing.quantity}` : ''}
                  </li>
                ))}
              </ul>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Instructions
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-line' }}>
                {recipe.instructions}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Catalog Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        disableAutoFocusItem
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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

      {/* Recommended Recipes Section */}
      {similar.length > 0 && (
        <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Recommended Recipes
            </Typography>
            <HorizontalScroll>
              {similar.map(r => (
                <RecipeCard key={r.recipe_id} recipe={r} />
              ))}
            </HorizontalScroll>
          </Paper>
        </Container>
      )}
    </>
  );
}
