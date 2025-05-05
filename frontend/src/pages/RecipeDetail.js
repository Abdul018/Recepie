import React, { useEffect, useState, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Grid, Paper, Button, Chip, Box, CircularProgress,
  IconButton, Menu, MenuItem, ListItemText, Divider, TextField
} from '@mui/material';
import { Favorite, FavoriteBorder, Add } from '@mui/icons-material';
import { api } from '../api/auth';
import { NavBar } from '../components/NavBar';
import  HorizontalScroll from '../components/HorizontalScroll';
import { RecipeCard } from '../components/RecipeCard';
export default function RecipeDetail() {
  /* ───────── URL + nav ───────── */
  const { recipe_id } = useParams();          // /recipe/:recipe_id  (string)
  const navigate = useNavigate();

  /* ───────── state ───────── */
  const [recipe,   setRecipe]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [isFav,    setIsFav]    = useState(false);

  /* catalog menu */
  const [anchorEl, setAnchorEl] = useState(null);
  const [catalogs, setCatalogs] = useState([]);   // always an array
  const [newName,  setNewName]  = useState('');
  const menuOpen = Boolean(anchorEl);
  const inputRef = useRef(null);

  const [similar, setSimilar] = useState([]);
  /* ───────── initial fetch ───────── */
  const fetchSimilar = async (rec) => {
  const tokens = rec.name
    .split(/\s+/)
    .map(w => w.replace(/[^\w]/g, '').toLowerCase())
    .filter(w => w.length > 2);

  const seen = new Set([String(rec.recipe_id)]);   // ensure self is excluded
  const all  = [];

  for (const tok of tokens) {
    try {
      const res = await api.get('search/', {
        params: { q: tok, exclude: rec.recipe_id, limit: 3 }
      });

      for (const r of res.data.results || []) {
        const key = String(r.recipe_id || r.id);   // normalise key
        if (!seen.has(key)) {
          seen.add(key);
          all.push(r);
          if (all.length >= 10) break;            // hard cap
        }
      }

    } catch (err) {
      console.warn('similar fetch failed:', tok, err.message);
    }
    if (all.length >= 10) break;                  // early exit
  }
  console.log(all);
  return all;
};

  useEffect(() => {
    if (!recipe_id) return;

    (async () => {
      try {
        const res = await api.get(`recipes/${recipe_id}/`);
        setRecipe(res.data);
//        console.log("here",res.data);
        fetchSimilar(res.data).then(setSimilar);
        setIsFav(res.data.is_favorite);       // comes from serializer
      } finally {
        setLoading(false);
      }
    })();
  }, [recipe_id]);

  /* ───────── favourite toggle ───────── */
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

  /* ───────── catalog helpers ───────── */
  const fetchCatalogs = async () => {
    const res = await api.get('catalogs/');
    setCatalogs(res.data.results || res.data);       // unwrap pagination
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
      fetchCatalogs();        // reflect the new catalog next time
    } catch {
      alert('Could not create catalog');
    }
  };

  /* ───────── render ───────── */
  if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 6 }} />;
  if (!recipe)   return <Typography align="center" sx={{ mt: 6 }}>Recipe not found</Typography>;





  return (
    <>
      <NavBar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>← Back</Button>

        {/* TOP SECTION */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={5}>
            <Paper elevation={1}>
              <img
                src={recipe.images?.[0] || 'https://via.placeholder.com/600x400'}
                alt={recipe.name}
                style={{ width: '100%', height: 'auto' }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography variant="h4" gutterBottom>{recipe.name}</Typography>

            <Box sx={{ my: 2 }}>
              {recipe.calories && <Chip label={`${recipe.calories} Cal`} sx={{ mr: 1 }}/> }
              {recipe.total_mins && <Chip label={`${recipe.total_mins} mins`}/> }
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <IconButton color="warning" onClick={toggleFav}>
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

        {/* BODY SECTION */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Ingredients</Typography>
                <ul style={{ marginLeft: 16 }}>
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx}>
                      {ing.name}{ing.quantity ? ` – ${ing.quantity}` : ''}
                    </li>
                  ))}
                </ul>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Instructions</Typography>
              <Typography sx={{ whiteSpace: 'pre-line' }}>
                {recipe.instructions}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
            {similar.length > 0 && (            /* show only when we have data */
                <Container maxWidth="lg" sx={{ mt: 6, mb: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    Recommended recipes
                  </Typography>
                </Container>
              )}
      <HorizontalScroll>
          {similar.map(r => (
            <RecipeCard key={r.recipe_id} recipe={r} />
          ))}
      </HorizontalScroll>

      {/* ─── Catalog Dropdown ─── */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          disableAutoFocusItem      // keep focus we set manually
        >
          <Box sx={{ px: 2, py: 1, width: 250 }}>
            <Typography variant="subtitle2">New Catalog…</Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="Catalog name"
              autoFocus               // caret appears
              inputRef={inputRef}     // allow effect to focus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createAndAdd()}
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button fullWidth sx={{ mt: 1 }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={createAndAdd}>
              Create & Add
            </Button>
          </Box>

          <Divider sx={{ my: 1 }} />
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
