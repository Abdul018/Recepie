// src/components/NavBar.js
import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Typography, TextField, IconButton } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
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

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ gap: 3 }}>
        {/* site name → home */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          Bite&nbsp;Delight
        </Typography>

        {/* 👉 Browse link */}
        <Typography
          component={RouterLink}
          to="/browse"
          sx={{ textDecoration: "none", color: "text.secondary" }}
        >
          Browse
        </Typography>

        {/* spacer */}
        <div style={{ flex: 1 }} />

        {/* Search bar with Enter key support */}
        <TextField
        size="small"
        placeholder="Search recipes…"
        sx={{ width: 300 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearch}
      />

        {/* avatar/logout */}
        <IconButton color="warning" onClick={() => (logout(), nav("/auth"))}>
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
