// src/components/HorizontalScroll.js
import { Box } from '@mui/material';

export default function HorizontalScroll({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        gap: 2,
        py: 1,
        '&::-webkit-scrollbar': { display: 'none' }, // hide scroll
      }}
    >
      {children}
    </Box>
  );
}
