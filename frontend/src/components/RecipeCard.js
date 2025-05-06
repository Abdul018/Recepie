// src/components/RecipeCard.js
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Typography, CardMedia, Box,
  IconButton
} from '@mui/material';
import { Delete } from '@mui/icons-material';

export function RecipeCard({ recipe, onRemove }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onRemove) return;            // disable navigation when trash is shown
    if (!recipe.recipe_id) {
      console.error('Recipe missing recipe_id:', recipe);
      return;
    }
    navigate(`/recipe/${recipe.recipe_id}`);
  };

  const imageUrl =
    recipe.image ||
    recipe.images?.[0] ||
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <Card
      sx={{ cursor: 'pointer', height: '100%', position: 'relative', borderRadius: 2, overflow: 'hidden' }}
      onClick={handleClick}
    >
      {/* optional delete icon */}
      {onRemove && (
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
            zIndex: 2,
            bgcolor: 'rgba(255,255,255,0.7)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
          }}
          onClick={(e) => {
            e.stopPropagation();     // prevent card navigation
            onRemove(recipe);
          }}
        >
          <Delete fontSize="inherit" />
        </IconButton>
      )}

      <CardMedia
        component="img"
        sx={{ height: 180, objectFit: 'cover', display: 'block' }}
        image={imageUrl}
        alt={recipe.name || 'Recipe image'}
      />

      {/* gradient overlay for name */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
          color: 'white',
          px: 1.5,
          pt: 2,
          pb: 1,
        }}
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {recipe.name}
        </Typography>
      </Box>
    </Card>
  );
}
