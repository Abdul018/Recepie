// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button } from '@mui/material'; // Keep Grid for overall structure if needed elsewhere, keep Box and Button
import { api } from '../api/auth';
import { NavBar } from '../components/NavBar';
import HorizontalScroll from '../components/HorizontalScroll'; // Import HorizontalScroll again
import { RecipeCard } from '../components/RecipeCard';
import { CatalogCard } from '../components/CatalogCard';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [recent, setRecent] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const navigate = useNavigate();

   useEffect(() => {
      /* one tiny helper so we can call it on mount AND on focus */
      const fetchDashboardData = async () => {
        try {
          const [r, f, c] = await Promise.all([
            api.get('recent/'),
            api.get('favorites/'),
            api.get('catalogs/')
          ]);
          // Removed the .slice() limit as horizontal scroll shows all
          setRecent(r.data.results || r.data);
          setFavorites(f.data.results || f.data);
          setCatalogs(c.data.results || c.data);
        } catch (err) {
          console.error(err);
        }
      };

      /* first load */
      fetchDashboardData();

      /* refresh whenever the tab/window gains focus */
      const handleFocus = () => fetchDashboardData();
      window.addEventListener('focus', handleFocus);

      /* clean-up */
      return () => window.removeEventListener('focus', handleFocus);
    }, []); // Empty dependency array

  // Removed the renderSectionGrid helper function

  return (
    <>
      <NavBar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Recently Accessed - Using HorizontalScroll */}
        <Box sx={{ mb: 4 }}> {/* Add bottom margin */}
           <Typography variant="h5" component="h2" gutterBottom>Recently Accessed</Typography>
           <HorizontalScroll>
             {recent.length === 0 ? (
               <Typography sx={{ ml: 1.5 }}>No recent recipes</Typography>
             ) : (
               recent.map(r => (
                  // Add some spacing between cards in horizontal scroll
                 <Box key={r.recipe_id} sx={{ width: 250, flexShrink: 0, mr: 2 }}>
                    <RecipeCard recipe={r} />
                 </Box>
               ))
             )}
           </HorizontalScroll>
        </Box>

        {/* Favourites - Using HorizontalScroll */}
         <Box sx={{ mb: 4 }}> {/* Add bottom margin */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h5" component="h2">Favourites</Typography>
                <Button size="small" onClick={() => navigate('/favorites')}>
                  View All
                </Button>
             </Box>
             <HorizontalScroll>
               {favorites.length === 0 ? (
                 <Typography sx={{ ml: 1.5 }}>No favorites yet</Typography>
               ) : (
                 favorites.map(r => (
                    <Box key={r.recipe_id} sx={{ width: 250, flexShrink: 0, mr: 2 }}>
                      <RecipeCard recipe={r} />
                    </Box>
                 ))
               )}
             </HorizontalScroll>
        </Box>

        {/* User Catalogs - Using HorizontalScroll */}
         <Box sx={{ mb: 4 }}> {/* Add bottom margin */}
             <Typography variant="h5" component="h2" gutterBottom>Your Catalogs</Typography>
             <HorizontalScroll>
               {catalogs.length === 0 ? (
                 <Typography sx={{ ml: 1.5 }}>No catalogs created yet</Typography>
               ) : (
                 catalogs.map(cat => (
                    <Box key={cat.id} sx={{ width: 250, flexShrink: 0, mr: 2 }}>
                        {/* Pass onClick handler for navigation */}
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
