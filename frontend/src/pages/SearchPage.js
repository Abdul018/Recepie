import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid } from '@mui/material';
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
    </>
  );
}
