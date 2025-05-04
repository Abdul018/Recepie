import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
export function CatalogCard({ catalog }) {
  return (
    <Card sx={{ minWidth: 200, flexShrink: 0 }}>
      <CardMedia component="img" height="120" image={catalog.cover_image || 'https://via.placeholder.com/200'} alt={catalog.name} />
      <CardContent sx={{ p: 1 }}>
        <Typography variant="body2" noWrap>{catalog.name}</Typography>
      </CardContent>
    </Card>
  );
}