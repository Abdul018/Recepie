// src/pages/Browse.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { getPredefinedCatalogTypes, getPredefinedCatalogs } from '../api/browse';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';

export default function Browse() {
  const [types, setTypes] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [typeRes, catRes] = await Promise.all([
        getPredefinedCatalogTypes(),
        getPredefinedCatalogs()
      ]);
      console.log("typeRes.data =", typeRes.data);
      setTypes(typeRes.data.results);
      setCatalogs(catRes.data.results);
    };
    fetchData();
  }, []);

  const getCatalogsForType = (typeId) => {
    return catalogs.filter(c => c.type === typeId);
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Browse Recipes</Typography>

        {types.map(type => (
          <Box key={type.id} sx={{ mb: 5 }}>
            <Typography variant="h5" gutterBottom>{type.name}</Typography>
            <Grid container spacing={3}>
              {getCatalogsForType(type.id).map(cat => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
                  <Card
                    sx={{ cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6 } }}
                    onClick={() => navigate(`/browse-catalog/${cat.id}`)}
                  >
                    <CardContent>
                      <Typography variant="h6">{cat.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
    </>
  );
}
