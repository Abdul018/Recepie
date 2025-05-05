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

// Default image URL
const DEFAULT_IMAGE_URL = 'https://placehold.co/600x400/E8E8E8/BDBDBD?text=No+Image';

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
    if (!rec || !rec.name) return []; // Guard against missing recipe or name
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

    setLoading(true);
    setRecipe(null);
    setSimilar([]);

    (async () => {
      try {
        const res = await api.get(`recipes/${recipe_id}/`);
        setRecipe(res.data);
        setIsFav(res.data.is_favorite);
        fetchSimilar(res.data).then(setSimilar);
      } catch (err) {
        console.error("Error fetching recipe details:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [recipe_id]);

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
    } catch (err){
       console.error('Could not update favourite:', err);
       alert('Could not update favourite');
    }
  };

  const fetchCatalogs = async () => {
    try {
      const res = await api.get('catalogs/');
      setCatalogs(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error fetching catalogs:", err);
      setCatalogs([]);
    }
  };

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
    fetchCatalogs();
  };

  useEffect(() => {
    if (menuOpen && inputRef.current) inputRef.current.focus();
  }, [menuOpen]); // Use menuOpen dependency

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNewName('');
  };

  const addToCatalog = async (id) => {
    try {
      await api.post(`catalogs/${id}/add-recipe/`, { recipe_id });
      alert('Added to catalog');
      handleMenuClose();
    } catch (err) {
      console.error("Failed to add to catalog:", err);
      alert('Failed to add');
    }
  };

  const createAndAdd = async () => {
    const trimmedName = newName.trim();
    if (!trimmedName) return;
    try {
      const res = await api.post('catalogs/', { name: trimmedName });
      await addToCatalog(res.data.id);
      // No need to fetchCatalogs here, as menu closes
      // If menu stayed open, you might want to refresh it
    } catch (err) {
      console.error("Could not create catalog:", err);
      alert('Could not create catalog');
    }
  };

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

  // Determine the image source, using the default if none is provided
  const imageUrl = recipe.images?.[0] || DEFAULT_IMAGE_URL;

  return (
    <>
      <NavBar />

      {/* Changed Container to lg for consistency, keep md if preferred */}
      <Container maxWidth="lg" sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          marginBottom: '20px'
       }}>
        {/* Changed variant to contained */}
        <Button variant="contained" onClick={() => navigate(-1)}>← Back</Button>

        <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2, mt: 3 }}>
          <Box
            component="img"
            src={imageUrl} // Use determined imageUrl
            alt={recipe.name}
            sx={{
              width: '100%',
              height: { xs: 250, sm: 350, md: 450 }, // Slightly increased height
              objectFit: 'cover',
              display: 'block',
              borderBottom: '1px solid #eee' // Add subtle border if needed
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
             {/* Ingredients Card */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, backgroundColor: '#ffffff' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Ingredients
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}> {/* Adjusted list styling */}
                {(recipe.ingredients || []).map((ing, idx) => (
                  <li key={idx}>
                    {ing.name}{ing.quantity ? ` – ${ing.quantity}` : ''}
                  </li>
                ))}
                {(recipe.ingredients || []).length === 0 && (
                    <Typography variant="body2" color="text.secondary">No ingredients listed.</Typography>
                )}
              </ul>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
             {/* Instructions Card */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, backgroundColor: '#ffffff' }}> 
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Instructions
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-line' }}>
                {recipe.instructions || 'No instructions provided.'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Recommended Recipes Section (Inside main container) */}
        {similar.length > 0 && (
          <Box sx={{ mt: 6, mb: 4 }}> 
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Recommended Recipes
            </Typography>
             {/* Added Paper wrapper for consistency */}
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2, backgroundColor: '#ffffff' }}>
              <HorizontalScroll>
                {similar.map(r => (
                  <RecipeCard key={r.recipe_id ?? r.id} recipe={r} />
                ))}
              </HorizontalScroll>
            </Paper>
          </Box>
        )}

      </Container>

      {/* Catalog Menu (remains outside main container) */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        disableAutoFocusItem
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ elevation: 3 }} // Added elevation
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
