import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>My Cart</Typography>
            <Typography>Your cart items will appear here.</Typography>

            <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/checkout')}>
                Proceed to Checkout
            </Button>
        </Box>
    );
};

export default Cart;
