import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid , Button } from '@mui/material';
import { NavBar } from '../components/NavBar';
import { searchCatalogs } from '../api/search';
import { RecipeCard } from '../components/RecipeCard'; // Assuming this displays catalog or recipe info

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const catalogResults = await searchCatalogs(query);
        setCatalogs(catalogResults);
      } catch (err) {
        console.error('Error fetching search data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <NavBar />
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
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search Results for "{query}"
        </Typography>

        {catalogs.length === 0 ? (
          <Typography>No results found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {catalogs.map((cat) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
                <RecipeCard
                  recipe={cat}
                  onClick={() => navigate(`/browse-catalog/${cat.id}`)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      </Container>
    </>
  );
}
