import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, CircularProgress, Box ,Button} from '@mui/material';
import { NavBar } from '../components/NavBar';
import { searchCatalogs } from '../api/search';
import { RecipeCard } from '../components/RecipeCard'; // Assuming this can display catalog info appropriately
import { CatalogCard } from '../components/CatalogCard'; // Or use CatalogCard if it's more suitable

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!query) {
        setCatalogs([]); // Clear results if query is empty
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Assuming searchCatalogs returns the expected format
        const catalogResults = await searchCatalogs(query);
        setCatalogs(catalogResults || []); // Ensure it's always an array
      } catch (err) {
        console.error('Error fetching search data:', err);
        setCatalogs([]); // Clear on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  // Decide whether to use RecipeCard or CatalogCard based on what searchCatalogs returns
  // Let's assume CatalogCard is more appropriate for displaying catalog search results
  const ResultCardComponent = CatalogCard; 

  return (
    <>
      <NavBar />
      {/* Apply the transparent style directly to the Container */}
      <Container 
        maxWidth="lg" 
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          marginBottom: '20px',
          minHeight: 'calc(100vh - 120px)' // Ensure container takes height minus NavBar/margins
        }}
      >
        <Button variant="contained" onClick={() => navigate(-1)}>← Back</Button>
        <Typography variant="h4" gutterBottom>
          Search Results for "{query}"
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
             <CircularProgress />
          </Box>
        ) : catalogs.length === 0 ? (
          <Typography sx={{ textAlign: 'center', mt: 4 }}>No results found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {catalogs.map((cat) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
                 {/* Use the selected card component */}
                <ResultCardComponent 
                  catalog={cat} // Pass data as 'catalog' prop if using CatalogCard
                  onClick={() => navigate(`/catalog/${cat.id}`)} // Navigate to specific catalog page
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
