import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

export function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!recipe.recipe_id) {
      console.error('Recipe missing recipe_id:', recipe);
      return;  // stop navigation if bad data
    }
    navigate(`/recipe/${recipe.recipe_id}`);   // ✅ use recipe_id not id
  };

  return (
    <Card sx={{ cursor: 'pointer', minWidth: 200 }} onClick={handleClick}>
      <CardMedia component="img" height="120" image={recipe.image || 'https://via.placeholder.com/200'} />
      <CardContent sx={{ p: 1 }}>
        <Typography variant="body2" noWrap>{recipe.name}</Typography>
      </CardContent>
    </Card>
  );
}
