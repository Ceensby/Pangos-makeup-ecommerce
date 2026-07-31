// Header.js - Top navigation bar with logo, search functionality, and cart badge
// Responsive: hamburger menu, account icon, collapsible search on mobile
// Live autocomplete suggestions dropdown (Amazon/Trendyol style)

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams, useLocation, Link as RouterLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Popper from "@mui/material/Popper";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, alpha } from "@mui/material/styles";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatTRY } from "../utils/formatPrice";
import axios from "axios";
import { API_BASE_URL } from "../config";
import pangosLogo from "../assets/pangos-logo.png";

/** Independent hanging vines — different x anchors, lengths, sway timings (md+ hover) */
const WELCOME_VINES = [
  { left: '6%', height: 88, rotate: -8, delay: 0, swayDur: '2.6s', color: '#2e7d32', leafSide: 'left' },
  { left: '22%', height: 118, rotate: -3, delay: 70, swayDur: '3.1s', color: '#388e3c', leafSide: 'right' },
  { left: '40%', height: 96, rotate: 2, delay: 130, swayDur: '2.4s', color: '#2e7d32', leafSide: 'left' },
  { left: '58%', height: 128, rotate: 5, delay: 40, swayDur: '3.4s', color: '#388e3c', leafSide: 'right' },
  { left: '74%', height: 102, rotate: -5, delay: 160, swayDur: '2.9s', color: '#2e7d32', leafSide: 'left' },
  { left: '90%', height: 112, rotate: 7, delay: 100, swayDur: '3.2s', color: '#388e3c', leafSide: 'right' },
];

// ─── Styled components ───────────────────────────────────────────────────────

// Search input container (desktop/tablet — always visible)
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
  maxWidth: '640px',
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

// Desktop search input style
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

// ─── Component ───────────────────────────────────────────────────────────────

export default function Header({ onMenuClick, onAccountClick, showMenuButton, showAccountButton }) {
  const { items } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);

  const welcomeName = (user?.fullName && user.fullName.trim()) || user?.username || 'there';

  // Autocomplete state
  const isMobileView = useMediaQuery('(max-width:599px)');
  const [suggestions, setSuggestions] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const allProductsRef = useRef([]);
  const productsLoadedRef = useRef(false);
  const debounceRef = useRef(null);
  const searchContainerRef = useRef(null);
  const appBarRef = useRef(null);

  // Calculate total items in cart
  const totalCount = items.reduce(
    (sum, it) => sum + (it.quantity || 1),
    0
  );

  // Keep input in sync with URL
  useEffect(() => {
    const qParam = searchParams.get('q');
    setSearchValue(qParam || '');
  }, [searchParams]);

  // ─── Autocomplete logic ──────────────────────────────────────────────────

  // Fetch all products for autocomplete (lazy, on first interaction)
  const loadProducts = useCallback(async () => {
    if (productsLoadedRef.current) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      allProductsRef.current = response.data || [];
      productsLoadedRef.current = true;
    } catch (err) {
      console.error('Failed to load products for autocomplete', err);
    }
  }, []);

  // Compute suggestions based on query (debounced)
  const updateSuggestions = useCallback((query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const q = query.toLowerCase();
      const products = allProductsRef.current;

      // Name matches first (highest relevance)
      const nameMatches = products.filter(p =>
        p.name && p.name.toLowerCase().includes(q)
      );

      let results = nameMatches.slice(0, 8);

      // Fill remaining slots with description/brand matches
      if (results.length < 8) {
        const usedIds = new Set(results.map(p => p.id));
        const otherMatches = products.filter(p =>
          !usedIds.has(p.id) && (
            (p.description && p.description.toLowerCase().includes(q)) ||
            (p.brand && p.brand.toLowerCase().includes(q))
          )
        );
        results = [...results, ...otherMatches.slice(0, 8 - results.length)];
      }

      setSuggestions(results);
    }, 150);
  }, []);

  // Handle input change — update value and compute suggestions
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (!productsLoadedRef.current) {
      loadProducts().then(() => updateSuggestions(value));
    } else {
      updateSuggestions(value);
    }
  };

  // Handle suggestion click — navigate to product detail
  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`);
    setSuggestions([]);
    setInputFocused(false);
    setSearchExpanded(false);
    setSearchValue('');
  };

  // Highlight matching substring in product name
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <strong>{text.slice(idx, idx + query.length)}</strong>
        {text.slice(idx + query.length)}
      </>
    );
  };

  // ─── Search navigation ──────────────────────────────────────────────────

  // Run search — navigate to current page with ?q=... or /products?q=...
  const handleSearch = () => {
    if (!searchValue.trim()) return;
    const q = encodeURIComponent(searchValue.trim());
    // If on home page, stay on home and filter carousels; otherwise go to /products
    if (location.pathname === '/') {
      navigate(`/?q=${q}`);
    } else {
      navigate(`/products?q=${q}`);
    }
    setSearchExpanded(false);
    setSuggestions([]);
    setInputFocused(false);
  };

  // Clear search input
  const handleClear = () => {
    setSearchValue('');
    setSearchExpanded(false);
    setSuggestions([]);
    setInputFocused(false);
    // Navigate to clean path (remove q param)
    if (location.pathname === '/products' && searchParams.get('q')) {
      navigate('/products');
    } else if (location.pathname === '/' && searchParams.get('q')) {
      navigate('/');
    }
  };

  // Key handler
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setInputFocused(false);
      if (searchExpanded) setSearchExpanded(false);
    }
  };

  // Focus handlers
  const handleFocus = () => {
    setInputFocused(true);
    if (!productsLoadedRef.current) {
      loadProducts().then(() => updateSuggestions(searchValue));
    } else if (searchValue.trim()) {
      updateSuggestions(searchValue);
    }
  };

  const handleBlur = () => {
    // Small delay so suggestion onMouseDown + onClick can fire before unmount
    setTimeout(() => setInputFocused(false), 200);
  };

  // ─── Suggestion dropdown ────────────────────────────────────────────────

  const shouldShowSuggestions = inputFocused && suggestions.length > 0;

  // On desktop, anchor to the search container; on mobile, anchor to the AppBar
  const popperAnchorEl = (isMobileView && searchExpanded)
    ? appBarRef.current
    : searchContainerRef.current;

  const renderSuggestions = () => (
    <Paper
      elevation={8}
      sx={{
        maxHeight: { xs: 'calc(100vh - 70px)', sm: 400 },
        overflow: 'auto',
        borderRadius: { xs: 0, sm: 1 },
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <List disablePadding>
        {suggestions.map((product, idx) => (
          <React.Fragment key={product.id}>
            <ListItemButton
              onMouseDown={(e) => e.preventDefault()} // prevent input blur
              onClick={() => handleSuggestionClick(product.id)}
              sx={{
                minHeight: 52,
                py: 1,
                px: 2,
                '&:hover': { bgcolor: '#fce4ec' },
              }}
            >
              <ListItemAvatar sx={{ minWidth: 52 }}>
                <Avatar
                  src={product.imageUrl || ''}
                  alt={product.name}
                  variant="rounded"
                  sx={{ width: 40, height: 40, bgcolor: '#f5f5f5' }}
                >
                  {product.name?.[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={highlightMatch(product.name, searchValue)}
                secondary={product.brand || ''}
                primaryTypographyProps={{
                  noWrap: true,
                  fontSize: '0.9rem',
                  sx: { '& strong': { color: 'primary.main' } },
                }}
                secondaryTypographyProps={{
                  noWrap: true,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                }}
              />
              <Typography
                variant="body2"
                color="primary"
                sx={{ ml: 1.5, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {formatTRY(product.price)}
              </Typography>
            </ListItemButton>
            {idx < suggestions.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      <AppBar position="sticky" ref={appBarRef} sx={{ overflow: 'visible' }}>
        <Toolbar sx={{ gap: { xs: 0.5, sm: 1 }, position: 'relative', overflow: 'visible' }}>
          {/* Hamburger menu button - visible on tablet/mobile */}
          {showMenuButton && (
            <IconButton
              color="inherit"
              aria-label="open categories menu"
              onClick={onMenuClick}
              edge="start"
              sx={{ minWidth: 44, minHeight: 44 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo - clickable to home */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              mr: { xs: 0.5, sm: 2 },
              flexShrink: 0,
            }}
          >
            <img
              src={pangosLogo}
              alt="Pangos Cosmetic Beauty"
              style={{ height: '40px', objectFit: 'contain', borderRadius: '8px' }}
            />
          </Box>

          {/* Search bar — desktop/tablet: always visible in toolbar flow */}
          <Search ref={searchContainerRef} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search products…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {/* Clear button */}
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

          {/* Search toggle icon — mobile only, when search is collapsed */}
          {!searchExpanded && (
            <IconButton
              color="inherit"
              aria-label="open search"
              onClick={() => setSearchExpanded(true)}
              sx={{
                display: { xs: 'inline-flex', sm: 'none' },
                minWidth: 44,
                minHeight: 44,
              }}
            >
              <SearchIcon />
            </IconButton>
          )}

          {/* Spacer — keeps greeting visually centered in the free header space */}
          <Box sx={{ flexGrow: 1, minWidth: 8 }} />

          {/* Site greeting — bold flat text; independent hanging vines on hover */}
          <Box
            className="welcome-greeting"
            sx={{
              display: { xs: 'none', sm: 'flex' },
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              px: { sm: 1, md: 1.5 },
              py: 0.5,
              flexShrink: 1,
              minWidth: 0,
              maxWidth: { sm: 300, md: 440, lg: 520 },
              overflow: 'visible',
              zIndex: 20,
              cursor: 'default',
              '@keyframes vineSway': {
                '0%, 100%': { transform: 'rotate(-2.8deg) translateX(-1px)' },
                '50%': { transform: 'rotate(2.8deg) translateX(1px)' },
              },
              '&:hover .vine-strand': {
                opacity: 0.92,
                transform: 'scaleY(1)',
              },
              '&:hover .vine-sway': {
                animationName: 'vineSway',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
              },
            }}
          >
            <Typography
              component="div"
              noWrap
              sx={{
                position: 'relative',
                zIndex: 2,
                fontFamily: '"Roboto", "Helvetica Neue", "Arial", sans-serif',
                fontStyle: 'normal',
                fontSize: { sm: '1.2rem', md: '1.5rem', lg: '1.7rem' },
                fontWeight: 600,
                lineHeight: 1.15,
                letterSpacing: '0.18em',
                minWidth: 0,
                color: '#ffffff',
                // Soft double-beat every ~10s — subtle, not constant
                '@keyframes welcomeHeartbeat': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '3%': { transform: 'scale(1.035)' },
                  '6%': { transform: 'scale(1)' },
                  '9%': { transform: 'scale(1.025)' },
                  '12%, 100%': { transform: 'scale(1)' },
                },
                animation: 'welcomeHeartbeat 10s ease-in-out infinite',
              }}
            >
              {isAuthenticated ? (
                <>Welcome back, {welcomeName}!</>
              ) : (
                <>Welcome to Pangos!</>
              )}
            </Typography>

            {/* Independent vines across text width — not a single-center fan */}
            <Box
              aria-hidden
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                left: 0,
                right: 0,
                top: '88%',
                height: 140,
                pointerEvents: 'none',
                zIndex: 1,
                overflow: 'visible',
              }}
            >
              {WELCOME_VINES.map((vine, index) => (
                <Box
                  key={index}
                  className="vine-strand"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: vine.left,
                    width: 36,
                    height: vine.height,
                    ml: '-18px',
                    transform: 'scaleY(0)',
                    transformOrigin: 'top center',
                    opacity: 0,
                    transition: 'transform 420ms ease, opacity 360ms ease',
                    transitionDelay: '0ms',
                    '.welcome-greeting:hover &': {
                      transitionDelay: `${vine.delay}ms`,
                    },
                  }}
                >
                  <Box
                    className="vine-sway"
                    sx={{
                      width: '100%',
                      height: '100%',
                      transformOrigin: 'top center',
                      animationDuration: vine.swayDur,
                      animationDelay: `${vine.delay + 200}ms`,
                      filter: 'drop-shadow(0 2px 2px rgba(46, 125, 50, 0.22))',
                    }}
                  >
                    <svg
                      width="36"
                      height={vine.height}
                      viewBox={`0 0 36 ${vine.height}`}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ display: 'block' }}
                    >
                      <path
                        d={`M18 0 C${18 + vine.rotate} ${vine.height * 0.28}, ${18 - vine.rotate} ${vine.height * 0.58}, ${18 + vine.rotate * 0.6} ${vine.height - 4}`}
                        stroke={vine.color}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                      <ellipse
                        cx={vine.leafSide === 'left' ? 9 : 27}
                        cy={vine.height * 0.32}
                        rx="7"
                        ry="4.5"
                        fill={vine.color === '#2e7d32' ? '#388e3c' : '#2e7d32'}
                        transform={`rotate(${vine.leafSide === 'left' ? -35 : 35} ${vine.leafSide === 'left' ? 9 : 27} ${vine.height * 0.32})`}
                      />
                      <ellipse
                        cx={vine.leafSide === 'left' ? 27 : 9}
                        cy={vine.height * 0.55}
                        rx="6.5"
                        ry="4"
                        fill={vine.color}
                        transform={`rotate(${vine.leafSide === 'left' ? 30 : -30} ${vine.leafSide === 'left' ? 27 : 9} ${vine.height * 0.55})`}
                      />
                      <ellipse
                        cx="18"
                        cy={vine.height * 0.78}
                        rx="6"
                        ry="3.8"
                        fill={vine.color === '#2e7d32' ? '#388e3c' : '#2e7d32'}
                        transform={`rotate(${vine.rotate * 2} 18 ${vine.height * 0.78})`}
                      />
                    </svg>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 8 }} />

          {/* Subtle separator before utility nav links */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: 'none', md: 'block' },
              alignSelf: 'center',
              height: 28,
              borderColor: 'rgba(255,255,255,0.35)',
              mr: 2,
            }}
          />

          {/* About Us and FAQ Links — hidden on mobile */}
          <Button
            color="inherit"
            component={RouterLink}
            to="/about"
            sx={{ mr: 2, textTransform: 'none', fontSize: '0.95rem', fontWeight: 400, display: { xs: 'none', md: 'inline-flex' } }}
          >
            About Us
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/faq"
            sx={{ mr: 2, textTransform: 'none', fontSize: '0.95rem', fontWeight: 400, display: { xs: 'none', md: 'inline-flex' } }}
          >
            FAQ
          </Button>

          {/* Account icon — visible when right sidebar is hidden */}
          {showAccountButton && (
            <IconButton
              color="inherit"
              aria-label="account menu"
              onClick={onAccountClick}
              sx={{ minWidth: 44, minHeight: 44 }}
            >
              <AccountCircleIcon />
            </IconButton>
          )}

          {/* Cart button */}
          <IconButton
            color="inherit"
            aria-label="cart"
            component={RouterLink}
            to="/cart"
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            <Badge badgeContent={totalCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* ===== Mobile search overlay ===== */}
          {searchExpanded && (
            <Box
              sx={{
                display: { xs: 'flex', sm: 'none' },
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                bgcolor: 'primary.main',
                zIndex: 2,
                alignItems: 'center',
                px: 1,
                gap: 0.5,
              }}
            >
              <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', ml: 1, flexShrink: 0 }} />
              <InputBase
                placeholder="Search products…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoFocus
                sx={{
                  flex: 1,
                  color: 'white',
                  bgcolor: alpha('#ffffff', 0.15),
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                  fontSize: '1rem',
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                    opacity: 1,
                  },
                }}
              />
              {/* Submit search */}
              {searchValue && (
                <IconButton
                  color="inherit"
                  onClick={handleSearch}
                  sx={{ minWidth: 44, minHeight: 44, flexShrink: 0 }}
                >
                  <SearchIcon />
                </IconButton>
              )}
              {/* Close / clear mobile search */}
              <IconButton
                color="inherit"
                aria-label="close search"
                onClick={() => {
                  setSearchExpanded(false);
                  setSuggestions([]);
                  setInputFocused(false);
                  if (searchValue) handleClear();
                }}
                sx={{ minWidth: 44, minHeight: 44, flexShrink: 0 }}
              >
                <ClearIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* ===== Autocomplete suggestions dropdown ===== */}
      {/* Rendered outside AppBar via portal so it floats below the header */}
      <Popper
        open={shouldShowSuggestions && !!popperAnchorEl}
        anchorEl={popperAnchorEl}
        placement="bottom-start"
        style={{
          zIndex: 1301,
          width: (isMobileView && searchExpanded)
            ? (appBarRef.current?.offsetWidth || '100%')
            : (searchContainerRef.current?.offsetWidth || 400),
        }}
        modifiers={[
          { name: 'offset', options: { offset: [0, 2] } },
        ]}
      >
        {renderSuggestions()}
      </Popper>
    </>
  );
}
