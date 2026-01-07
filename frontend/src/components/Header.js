// Header.js - Top navigation bar with logo, search functionality, and cart badge

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Badge from "@mui/material/Badge";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import { styled, alpha } from "@mui/material/styles";
import { useCart } from "../context/CartContext";
import pangosLogo from "../assets/pangos-logo.png";

// Styled search input container
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: 'auto',
  flex: 1,
  maxWidth: '500px',
}));

// Search icon wrapper
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// Styled input field
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

export default function Header() {
  const { items } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');

  // Calculate total items in cart
  const totalCount = items.reduce(
    (sum, it) => sum + (it.quantity || 1),
    0
  );

  // Sync search input with URL query parameter
  useEffect(() => {
    const qParam = searchParams.get('q');
    setSearchValue(qParam || '');
  }, [searchParams]);

  // Handle search button click or Enter key
  const handleSearch = () => {
    if (!searchValue.trim()) return;

    // Keep existing URL params, add or update 'q'
    const params = new URLSearchParams(searchParams);
    params.set('q', searchValue.trim());
    navigate(`/?${params.toString()}`);
  };

  // Clear search input and remove 'q' param
  const handleClear = () => {
    setSearchValue('');

    const params = new URLSearchParams(searchParams);
    params.delete('q');
    const paramString = params.toString();
    navigate(paramString ? `/?${paramString}` : '/');
  };

  // Trigger search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {/* Logo - clickable to home */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            mr: 2
          }}
        >
          <img
            src={pangosLogo}
            alt="Pangos Cosmetic Beauty"
            style={{
              height: '40px',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />
        </Box>

        {/* Search bar */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search products…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {/* Clear button (shows when there's text) */}
          {searchValue && (
            <IconButton
              size="small"
              onClick={handleClear}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        {/* Cart icon with item count badge */}
        <IconButton
          color="inherit"
          aria-label="cart"
          component={RouterLink}
          to="/cart"
        >
          <Badge badgeContent={totalCount} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
