import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, CardMedia, Box } from '@mui/material'; // Added Box

export function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!recipe.recipe_id) {
      console.error('Recipe missing recipe_id:', recipe);
      return;
    }
    navigate(`/recipe/${recipe.recipe_id}`);
  };

  // Default placeholder image URL
  const imageUrl = recipe.image || recipe.images?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    // Added height and relative positioning for overlay
    <Card sx={{ cursor: 'pointer', height: '100%', position: 'relative', borderRadius: '8px', overflow: 'hidden' }} onClick={handleClick}>
       <CardMedia
          component="img"
          // Adjusted height and objectFit for better image display
          sx={{ height: 180, objectFit: 'cover', display: 'block' }} // Ensure image behaves as a block
          image={imageUrl}
          alt={recipe.name || 'Recipe image'} // Added alt text
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
            boxSizing: 'border-box', // Include padding in width
          }}
        >
          <Typography
             variant="body1" // Slightly larger variant
             fontWeight="bold" // Make text bold
             sx={{
                // Prevent text overflow issues
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
             }}
          >
            {recipe.name}
          </Typography>
      </Box>
    </Card>
  );
}
