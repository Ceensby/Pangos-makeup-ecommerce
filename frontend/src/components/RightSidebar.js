import React from 'react';
import { Box, Typography, Button, Divider, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';
import { formatTRY } from '../utils/formatPrice';

const rightSidebarBg = '#e8f5e9'; // Light greenish

const RightSidebar = () => {
    const navigate = useNavigate();
    const { items, remove } = useCart();

    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <Box sx={{ width: 300, bgcolor: rightSidebarBg, minHeight: '100vh', padding: 2, borderLeft: '1px solid #c8e6c9', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ color: '#2e7d32', mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Guest
            </Typography>

            <Button
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={<ListAltIcon />}
                onClick={() => navigate('/orders')}
                sx={{ mb: 2, bgcolor: 'white' }}
            >
                My Orders
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ color: '#2e7d32', mb: 1, fontWeight: 'bold' }}>
                Cart ({items.length})
            </Typography>

            {items.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Your cart is empty.</Typography>
            ) : (
                <Box>
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

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" align="right" sx={{ mb: 1 }}>
                            Total: {formatTRY(cartTotal)}
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => navigate('/cart')}
                        >
                            Go to Cart
                        </Button>
                    </Box>
                </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary" align="center" fontSize="0.75rem">
                Welcome to Pangos!
            </Typography>
        </Box>
    );
};

export default RightSidebar;
