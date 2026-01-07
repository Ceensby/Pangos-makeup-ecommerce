import React from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatTRY } from '../utils/formatPrice';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Cart = () => {

    // Navigation helper
    const navigate = useNavigate();

    // Cart items and actions
    const { items, add, decrement, remove, clear } = useCart();

    // Calculate total amount from cart items
    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <Box>
            {/* Back to product list */}
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
                Continue Shopping
            </Button>

            {/* Page title */}
            <Typography variant="h4" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>My Cart</Typography>

            {/* Empty cart state */}
            {items.length === 0 ? (
                <Typography variant="h6">Your cart is empty.</Typography>
            ) : (
                <>
                    {/* Cart table */}
                    <TableContainer component={Paper} elevation={0} variant="outlined">
                        <Table>
                            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>

                                        {/* Product name */}
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                            {item.name}
                                        </TableCell>

                                        {/* Unit price */}
                                        <TableCell align="right">{formatTRY(item.price)}</TableCell>

                                        {/* Quantity controls */}
                                        <TableCell align="center">
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <IconButton size="small" onClick={() => decrement(item.id)}><RemoveIcon fontSize="small" /></IconButton>
                                                <Box component="span" sx={{ mx: 2 }}>{item.quantity}</Box>
                                                <IconButton size="small" onClick={() => add(item)}><AddIcon fontSize="small" /></IconButton>
                                            </Box>

                                            {/* Row total */}
                                        </TableCell>
                                        <TableCell align="right">{formatTRY(item.price * item.quantity)}</TableCell>

                                        {/* Remove item */}
                                        <TableCell align="center">
                                            <IconButton color="error" onClick={() => remove(item.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Cart summary and actions */}
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Total: {formatTRY(cartTotal)}
                        </Typography>
                        <Box>
                            {/* Clear entire cart */}
                            <Button variant="outlined" color="error" onClick={clear} sx={{ mr: 2 }}>
                                Clear Cart
                            </Button>

                            {/* Go to checkout */}
                            <Button variant="contained" size="large" onClick={() => navigate('/checkout')}>
                                Proceed to Checkout
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Cart;
