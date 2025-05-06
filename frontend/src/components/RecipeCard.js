// src/components/RecipeCard.js
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Typography, CardMedia, Box,
  IconButton, Stack
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';

export function RecipeCard({ recipe, onRemove }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onRemove) return;                    // disable nav when delete mode
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
  <motion.div whileHover={{ scale: 1.05 }} style={{ height: '100%' }}>
    <Card
      sx={{ cursor: 'pointer', borderRadius: 2, overflow: 'hidden', position: 'relative' }}
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
            e.stopPropagation();
            onRemove(recipe);
          }}
        >
          <Delete fontSize="inherit" />
        </IconButton>
      )}

      {/* image */}
      <CardMedia
        component="img"
        image={imageUrl}
        alt={recipe.name || 'Recipe image'}
        sx={{ height: 180, objectFit: 'cover', display: 'block' }}
      />

      {/* text block */}
      <CardContent sx={{ py: 1.5, px: 2 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          gutterBottom={!!(recipe.calories || recipe.total_mins)}
          sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {recipe.name}
        </Typography>

        {(recipe.calories || recipe.total_mins) && (
          <Typography variant="body2" color="text.secondary">
            {recipe.calories && `${recipe.calories} Cal`}
            {recipe.calories && recipe.total_mins && ' · '}
            {recipe.total_mins && `${recipe.total_mins} mins`}
          </Typography>
        )}
      </CardContent>
    </Card>
  </motion.div>
  );
}