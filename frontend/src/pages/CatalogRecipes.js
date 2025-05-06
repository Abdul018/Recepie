// src/pages/CatalogRecipes.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
   Container, Typography, Grid, Button, CircularProgress, Box,
    IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogActions
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { api } from '../api/auth';
import { RecipeCard } from '../components/RecipeCard';
import { NavBar } from '../components/NavBar';

export default function CatalogRecipes() {
  const { catalog_id } = useParams();           // /browse-catalog/:catalog_id
  const navigate      = useNavigate();

  const [catalog, setCatalog] = useState(null); // { id, name, is_owner, recipes:[] }
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [dlgOpen,   setDlgOpen]   = useState(false);

  /* ---------- fetch once ---------- */
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await api.get(`catalogs/${catalog_id}/`);
        setCatalog(res.data);
      } catch (err) {
        console.error(err);
        setCatalog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [catalog_id]);

  /* ---------- delete handler ---------- */
  const handleRemove = async (recipe) => {
    try {
      await api.delete(
        `catalogs/${catalog_id}/remove-recipe/${recipe.recipe_id}/`
      );
      // update local state
      setCatalog(prev => ({
        ...prev,
        recipes: prev.recipes.filter(r => r.recipe_id !== recipe.recipe_id)
      }));
    } catch {
      alert('Could not remove recipe');
    }
  };

  /* ---------- loading / error states ---------- */
  if (loading) return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      </Container>
    </>
  );

  if (!catalog) return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => navigate(-1)}>
          ← Back to Browse
        </Button>
        <Typography variant="h4" sx={{ mt: 3 }} align="center">
          Catalog not found
        </Typography>
      </Container>
    </>
  );

  /* ---------- main render ---------- */
  const { is_owner, recipes } = catalog;

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
        <Button variant="outlined" onClick={() => navigate(-1)}>← Back</Button>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>{catalog.name}</Typography>
        {catalog.is_owner && (
          <>
            <IconButton
              aria-label="catalog options"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
              <MoreVert />
            </IconButton>

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
               >
                 <MenuItem
                   onClick={() => {
                     setMenuAnchor(null);
                     setDlgOpen(true);              // open confirm dialog
                   }}
                 >
                   Delete catalog
                 </MenuItem>
               </Menu>
             </>
           )}
         </Box>
        {recipes.length === 0 ? (
          <Typography>No recipes in this catalog yet.</Typography>
        ) : (
          <Grid container spacing={3}>
            {recipes.map(r => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={r.recipe_id}>
                <RecipeCard
                  recipe={r}
                  onClick={() => navigate(`/recipe/${r.recipe_id}`)}
                  onRemove={is_owner ? handleRemove : undefined}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      + {/* ---------- confirm‑delete dialog ---------- */}
      <Dialog open={dlgOpen} onClose={() => setDlgOpen(false)}>
         <DialogTitle>Delete this catalog permanently?</DialogTitle>
         <DialogActions>
           <Button onClick={() => setDlgOpen(false)}>Cancel</Button>
           <Button
             color="error"
             onClick={async () => {
               try {
                 await api.delete(`catalogs/${catalog.id}/`);
                 navigate('/');                   // or navigate(-1) if preferred
               } catch {
                 alert('Could not delete catalog');
               }
             }}
           >
             Delete
           </Button>
         </DialogActions>
       </Dialog>
    </>
  );
}
