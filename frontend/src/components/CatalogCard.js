import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material'; // Added Box
import { useNavigate } from 'react-router-dom'; // Import if using navigate onClick

export function CatalogCard({ catalog, onClick }) { // Accept onClick prop
   // Default placeholder image URL
   const imageUrl = catalog.cover_image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
     // Added height and relative positioning for overlay
     // Use onClick prop passed from Home.js
    <Card sx={{ cursor: 'pointer', height: '100%', position: 'relative', borderRadius: '8px', overflow: 'hidden' }} onClick={onClick}>
       <CardMedia
          component="img"
          // Adjusted height and objectFit
           sx={{ height: 180, objectFit: 'cover', display: 'block' }}
           image={imageUrl}
           alt={catalog.name || 'Catalog image'} // Added alt text
        />
        {/* Overlay Box for text with gradient */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
             // Changed bgcolor to a linear gradient background
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
            color: 'white',
            padding: '16px 12px 8px 12px', // Adjusted padding (more top padding for gradient)
            boxSizing: 'border-box',
          }}
        >
          <Typography
             variant="body1" // Slightly larger variant
             fontWeight="bold" // Make text bold
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
             }}
          >
            {catalog.name}
          </Typography>
       </Box>
    </Card>
  );
}
