import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Divider,
    Grid
} from '@mui/material';
import { formatTRY } from '../utils/formatPrice';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/orders/me';

function MyOrders() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Orders state
    const [orders, setOrders] = useState([]);

    // UI states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load orders on first render
    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Fetch user's orders from backend
    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(API_URL);
            console.log('📦 Orders received from API:', response.data);

            // Filter out orders with ID < 20 and sort newest first
            const filteredOrders = response.data
                .filter(order => order.id >= 20)
                .sort((a, b) => b.id - a.id);

            console.log('📦 Filtered & sorted orders:', filteredOrders);
            console.log('📦 First order orderItems:', filteredOrders[0]?.orderItems);
            setOrders(filteredOrders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError('Please login to view your orders');
            } else {
                setError('Failed to load orders. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Loading UI
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return (
            <Box>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                    My Orders
                </Typography>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Please login to view your orders
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                        You need to be logged in to see your order history.
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/login')}>
                        Login
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/signup')} sx={{ ml: 2 }}>
                        Sign Up
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box>
            {/* Page title */}
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                My Orders
            </Typography>

            {/* Error message */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Empty state for orders */}
            {orders.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary" gutterBottom>
                        No orders found. Start shopping to create your first order!
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2, bgcolor: '#e91e63', color: 'white', '&:hover': { bgcolor: '#c2185b' } }}>
                        Browse Products
                    </Button>
                </Paper>
            ) : (
                // Orders card list
                <Box>
                    {orders.map((order) => (
                        <Card key={order.id} elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                            <CardContent>
                                {/* Order Header */}
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                                            Order #{order.id}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box textAlign="right">
                                        <Typography variant="h6" fontWeight="bold" color="#e91e63">
                                            {order.amount ? formatTRY(order.amount) : 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Order Items - Product Details */}
                                {order.orderItems && order.orderItems.length > 0 ? (
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 2 }}>
                                            Items Purchased
                                        </Typography>
                                        {order.orderItems.map((item, index) => {
                                            const productId = item.product?.id || item.productId;
                                            return (
                                                <Box
                                                    key={index}
                                                    display="flex"
                                                    alignItems="center"
                                                    py={1.5}
                                                    borderBottom={index < order.orderItems.length - 1 ? '1px solid #f0f0f0' : 'none'}
                                                    onClick={() => productId && navigate(`/products/${productId}`)}
                                                    sx={{
                                                        cursor: productId ? 'pointer' : 'default',
                                                        '&:hover': productId ? {
                                                            bgcolor: '#f5f5f5',
                                                            transition: 'background-color 0.2s'
                                                        } : {}
                                                    }}
                                                >
                                                    {/* Product Image */}
                                                    <Box
                                                        component="img"
                                                        src={item.productImageUrl || item.product?.imageUrl || 'https://via.placeholder.com/60?text=No+Image'}
                                                        alt={item.productName || item.product?.name || 'Product'}
                                                        sx={{
                                                            width: 60,
                                                            height: 60,
                                                            objectFit: 'contain',
                                                            borderRadius: 1,
                                                            border: '1px solid #e0e0e0',
                                                            mr: 2,
                                                            bgcolor: '#fafafa'
                                                        }}
                                                    />

                                                    {/* Product Info */}
                                                    <Box flex={1}>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {item.productName || item.product?.name || 'Product'}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {item.quantity}× {formatTRY(item.price)}
                                                        </Typography>
                                                    </Box>

                                                    {/* Line Total */}
                                                    <Typography variant="body1" fontWeight="bold" color="text.primary">
                                                        {formatTRY(item.quantity * item.price)}
                                                    </Typography>
                                                </Box>
                                            )
                                        })}
                                    </Box>
                                ) : (
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                            No product details available for this order
                                        </Typography>
                                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                            Debug: orderItems = {order.orderItems ? `array with ${order.orderItems.length} items` : 'null/undefined'}
                                        </Typography>
                                        {order.orderItems && order.orderItems.length === 0 && (
                                            <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
                                                ⚠️ Order has empty orderItems array - this order was likely created before the feature was added
                                            </Typography>
                                        )}
                                        {!order.orderItems && (
                                            <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
                                                ⚠️ orderItems is null/undefined - backend may need restart or old order
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                {/* Shipping Address */}
                                <Box mt={3} p={2} bgcolor="#f9f9f9" borderRadius={1}>
                                    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                                        Shipping Address
                                    </Typography>
                                    <Typography variant="body2">
                                        {order.customerName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {order.phoneNumber}
                                    </Typography>
                                    <Typography variant="body2">
                                        {order.addressLine}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {order.city}, {order.postalCode}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default MyOrders;
