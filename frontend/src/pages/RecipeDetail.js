import React, { useEffect, useState, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Grid, Paper, Button, Chip, Box, CircularProgress,
  IconButton, Menu, MenuItem, ListItemText, Divider, TextField
} from '@mui/material';
import { Favorite, FavoriteBorder, Add } from '@mui/icons-material';
import { api } from '../api/auth';
import { NavBar } from '../components/NavBar';

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
  /* ───────── initial fetch ───────── */
  useEffect(() => {
    if (!recipe_id) return;

    (async () => {
      try {
        const res = await api.get(`recipes/${recipe_id}/`);
        setRecipe(res.data);
        console.log("here",res.data);
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
  
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>← Back</Button>
  
        {/* IMAGE SECTION */}
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
  
        {/* CONTENT SECTION */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {recipe.name}
          </Typography>
  
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
            {recipe.calories && <Chip label={`${recipe.calories} Cal`} variant="outlined" />}
            {recipe.total_mins && <Chip label={`${recipe.total_mins} mins`} variant="outlined" />}
          </Box>
  
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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
        </Box>
  
        {/* BODY SECTION */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
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
            <Paper sx={{ p: 3, borderRadius: 2 }}>
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
  
      {/* ─── Catalog Dropdown ─── */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
        {/* Catalog list can be added here */}
      </Menu>
    </>
  );
}  