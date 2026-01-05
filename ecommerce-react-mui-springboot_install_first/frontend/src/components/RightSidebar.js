import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';

const rightSidebarBg = '#e8f5e9'; // Light greenish

const RightSidebar = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ width: 220, bgcolor: rightSidebarBg, minHeight: '100vh', padding: 2, borderLeft: '1px solid #c8e6c9' }}>
            <Typography variant="h6" sx={{ color: '#2e7d32', mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Guest
            </Typography>

            <Button
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={<ShoppingCartIcon />}
                onClick={() => navigate('/cart')}
                sx={{ mb: 2, bgcolor: 'white' }}
            >
                My Cart
            </Button>

            <Button
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={<ListAltIcon />}
                onClick={() => navigate('/my-orders')}
                sx={{ mb: 2, bgcolor: 'white' }}
            >
                My Orders
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary" align="center">
                Welcome to Pangos!
            </Typography>
        </Box>
    );
};

export default RightSidebar;
