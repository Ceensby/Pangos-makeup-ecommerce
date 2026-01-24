// RightSidebar.js - Cart preview sidebar with user section and quick cart actions

import React from 'react';
import { Box, Typography, Button, Divider, List, ListItem, ListItemText, IconButton, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatTRY } from '../utils/formatPrice';

// Light green background
const rightSidebarBg = '#e8f5e9';

const RightSidebar = () => {
    const navigate = useNavigate();
    const { items, remove } = useCart();
    const { isAuthenticated, user, logout } = useAuth();

    // Calculate total price of all cart items
    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Helper function to capitalize the first letter of a string (display only)
    const capitalizeFirstLetter = (str) => {
        if (!str || typeof str !== 'string') return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Box sx={{ width: 300, bgcolor: rightSidebarBg, minHeight: '100vh', padding: 2, borderLeft: '1px solid #c8e6c9', display: 'flex', flexDirection: 'column' }}>

            {/* Welcome message */}
            <Typography
                variant="h5"
                align="center"
                sx={{
                    mb: 1,
                    color: '#388e3c',
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1.5rem',
                    fontWeight: 700
                }}
            >
                Welcome to Pangos!
            </Typography>

            {/* User info */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 0.5 }}>
                    {isAuthenticated ? capitalizeFirstLetter(user?.username) || 'User' : 'Guest'}
                </Typography>
                {isAuthenticated && user?.fullName && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        {user.fullName}
                    </Typography>
                )}
            </Box>

            {/* Account Section */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#2e7d32', mb: 1, fontWeight: 'bold' }}>
                    Account
                </Typography>

                {/* Not logged in - Show Sign In/Sign Up */}
                {!isAuthenticated ? (
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            startIcon={<LoginIcon />}
                            onClick={() => navigate('/login')}
                            sx={{ bgcolor: 'primary.main' }}
                        >
                            Sign In
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </Button>
                    </Box>
                ) : (
                    /* Logged in - Show Profile/Addresses/Credit Cards/Logout */
                    <List dense disablePadding>
                        <ListItemButton onClick={() => navigate('/profile')}>
                            <PersonIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                            <ListItemText primary="Profile" primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItemButton>
                        <ListItemButton onClick={() => navigate('/addresses')}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                            <ListItemText primary="Manage Addresses" primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItemButton>
                        <ListItemButton onClick={() => navigate('/credit-cards')}>
                            <CreditCardIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                            <ListItemText primary="Manage Credit Cards" primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItemButton>
                    </List>
                )}
            </Box>

            {/* My Orders button */}
            <Button
                fullWidth
                variant="contained"
                startIcon={<ListAltIcon />}
                onClick={() => navigate('/orders')}
                sx={{
                    mb: 1,
                    bgcolor: '#e91e63',
                    color: 'white',
                    '&:hover': { bgcolor: '#c2185b' },
                    fontSize: '0.875rem',
                    py: 0.75,
                    whiteSpace: 'nowrap'
                }}
            >
                My Orders
            </Button>

            {/* Log Out Button - moved below My Orders */}
            {isAuthenticated && (
                <Button
                    fullWidth
                    variant="text"
                    startIcon={<LogoutIcon fontSize="small" />}
                    onClick={handleLogout}
                    sx={{
                        mb: 2,
                        color: 'error.main',
                        fontSize: '0.875rem',
                        justifyContent: 'flex-start',
                        pl: 1
                    }}
                >
                    Log Out
                </Button>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Cart section */}
            <Typography variant="h6" sx={{ color: '#2e7d32', mb: 1, fontWeight: 'bold' }}>
                Cart ({items.length})
            </Typography>

            {items.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Your cart is empty.</Typography>
            ) : (
                <Box>
                    {/* Cart items list */}
                    <List dense>
                        {items.map((item) => (
                            <ListItem key={item.id}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => remove(item.id)} size="small">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={item.name}
                                    secondary={`${item.quantity} x ${formatTRY(item.price)}`}
                                    primaryTypographyProps={{ noWrap: true, variant: 'body2', fontWeight: 500 }}
                                />
                            </ListItem>
                        ))}
                    </List>

                    {/* Cart total and navigation button */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" align="right" sx={{ mb: 1 }}>
                            Total: {formatTRY(cartTotal)}
                        </Typography>
                        {/* Navigate to full cart page */}
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => navigate('/cart')}
                            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                            Go to Cart
                        </Button>
                    </Box>
                </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Divider sx={{ my: 2 }} />
        </Box>
    );
};

export default RightSidebar;
