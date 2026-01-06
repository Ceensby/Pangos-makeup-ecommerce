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
import PaymentIcon from '@mui/icons-material/Payment';
import { formatTRY } from '../utils/formatPrice';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/orders';

function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(API_URL);
            setOrders(response.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayClick = (orderId) => {
        navigate(`/payment?orderId=${orderId}`);
    };

    const getStatusColor = (status) => {
        return status === 'PAID' ? 'success' : 'warning';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                My Orders
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {orders.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        No orders found. Start shopping to create your first order!
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                        Browse Products
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper} elevation={2}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell><strong>Order ID</strong></TableCell>
                                <TableCell><strong>Customer</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell align="right"><strong>Amount</strong></TableCell>
                                <TableCell align="center"><strong>Status</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell>#{order.id}</TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>{order.email}</TableCell>
                                    <TableCell align="right">
                                        {order.amount ? formatTRY(order.amount) : 'N/A'}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={order.status || 'PENDING'}
                                            color={getStatusColor(order.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        {order.status !== 'PAID' ? (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                startIcon={<PaymentIcon />}
                                                onClick={() => handlePayClick(order.id)}
                                            >
                                                Pay
                                            </Button>
                                        ) : (
                                            <Typography variant="body2" color="success.main">
                                                ✓ Paid
                                            </Typography>
                                        )}
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
