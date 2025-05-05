// src/components/NavBar.js
import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, TextField, IconButton, Box, Link } from "@mui/material";
// Removed logo import as we are using Typography for the title
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from '@mui/icons-material/Search'; // Import SearchIcon
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export function NavBar() {
  const { logout } = useContext(AuthContext);
  const nav = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      nav(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Define a primary color for consistency, e.g., a deep orange or teal
  const primaryColor = '#ff6347'; // Example: Tomato color, adjust as needed

  return (
    // Use a clean background color, maybe white or very light grey
    <AppBar position="sticky" sx={{ bgcolor: '#ffffff', color: '#333333' }} elevation={1}>
      <Toolbar sx={{ gap: 2, minHeight: '64px' }}> {/* Adjusted minHeight and gap */}
        {/* Site title */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: "none",
            color: primaryColor, // Use primary color for the title
            fontWeight: 'bold',
            flexShrink: 0 // Prevent shrinking
          }}
        >
          Bite&nbsp;Delight
        </Typography>

        {/* Browse link */}
        <Link
          component={RouterLink}
          to="/browse"
          sx={{
            textDecoration: "none",
            color: "text.secondary", // Use secondary text color
            typography: 'body1', // Slightly larger body text
            fontWeight: 'medium',
            '&:hover': {
              color: primaryColor, // Highlight on hover
            }
          }}
        >
          Browse
        </Link>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} /> {/* Use Box for spacer */}

        {/* Search bar with integrated icon */}
         <TextField
            variant="outlined" // Use outlined variant for a modern look
            size="small"
            placeholder="Search recipes…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            sx={{
              width: { xs: 150, sm: 250, md: 300 }, // Responsive width
              '& .MuiOutlinedInput-root': { // Style the input container
                borderRadius: '20px', // Rounded corners
                backgroundColor: '#f0f0f0', // Light grey background
                '& fieldset': {
                  borderColor: 'transparent', // Hide the default border
                },
                '&:hover fieldset': {
                  borderColor: '#dddddd', // Subtle border on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor, // Highlight border when focused
                },
              },
               '& .MuiInputBase-input': { // Style the input text itself
                 paddingLeft: '14px',
               },
            }}
            InputProps={{ // Add search icon inside the text field
                startAdornment: (
                    <SearchIcon sx={{ color: 'text.disabled', marginRight: '8px' }} />
                ),
            }}
        />


        {/* Logout Icon */}
        <IconButton
            // Use primary color for the icon button
            sx={{ color: primaryColor }}
            onClick={() => (logout(), nav("/auth"))}
            aria-label="Account options"
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
