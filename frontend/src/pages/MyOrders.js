import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    CircularProgress,
    Alert
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
            setOrders(response.data);
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

    // Map status to MUI Chip color
    const getStatusColor = (status) => {
        if (status === 'PAID') return 'success';
        if (status === 'PENDING') return 'warning';
        if (status === 'CONFIRMED') return 'info';
        return 'default';
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
                    <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                        Browse Products
                    </Button>
                </Paper>
            ) : (
                // Orders table
                <TableContainer component={Paper} elevation={2}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell><strong>Order ID</strong></TableCell>
                                <TableCell><strong>Customer</strong></TableCell>
                                <TableCell><strong>Address</strong></TableCell>
                                <TableCell align="right"><strong>Amount</strong></TableCell>
                                <TableCell align="center"><strong>Status</strong></TableCell>
                                <TableCell align="center"><strong>Date</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell>#{order.id}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                            {order.customerName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {order.phoneNumber}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {order.addressLine}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {order.city}, {order.postalCode}
                                        </Typography>
                                    </TableCell>

                                    {/* Price formatting */}
                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight="bold">
                                            {order.amount ? formatTRY(order.amount) : 'N/A'}
                                        </Typography>
                                    </TableCell>

                                    {/* Status badge */}
                                    <TableCell align="center">
                                        <Chip
                                            label={order.status || 'PENDING'}
                                            color={getStatusColor(order.status)}
                                            size="small"
                                        />
                                    </TableCell>

                                    {/* Order date */}
                                    <TableCell align="center">
                                        <Typography variant="caption" color="text.secondary">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default MyOrders;
