import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    Divider
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatTRY } from '../utils/formatPrice';
import axios from 'axios';

// Backend endpoints
const ORDERS_API = 'http://localhost:8080/api/orders';
const PAYMENTS_API = 'http://localhost:8080/api/payments';

function Payment() {

    // Navigation helper
    const navigate = useNavigate();

    // Read query parameters from URL
    const [searchParams] = useSearchParams();
    const orderIdFromUrl = searchParams.get('orderId');

    // Order state
    const [orderId, setOrderId] = useState(orderIdFromUrl || '');
    const [order, setOrder] = useState(null);

    // UI states
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Payment Form fields
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [email, setEmail] = useState('');

    // Auto fetch order when orderId exists in URL
    useEffect(() => {
        if (orderIdFromUrl) {
            fetchOrderDetails(orderIdFromUrl);
        }
    }, [orderIdFromUrl]);

    // Fetch order details from backend
    const fetchOrderDetails = async (id) => {
        if (!id) return;

        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${ORDERS_API}/${id}`);
            const orderData = response.data;

            // If already paid, block payment side
            if (orderData.status === 'PAID') {
                setError('This order has already been paid.');
                setOrder(orderData);
            } else {
                setOrder(orderData);
                setEmail(orderData.email || '');
            }
        } catch (err) {
            setError('Order not found. Please check the Order ID.');
        } finally {
            setLoading(false);
        }
    };

    // Manual fetch button handler
    const handleFetchOrder = () => {
        if (!orderId.trim()) {
            setError('Please enter an Order ID');
            return;
        }
        fetchOrderDetails(orderId.trim());
    };

    // Basic client-side validation
    const validateForm = () => {
        if (!cardholderName.trim()) return 'Cardholder name is required';
        if (!cardNumber.trim() || cardNumber.length < 13) return 'Valid card number is required';
        if (!expiry.trim() || !/^\d{2}\/\d{2}$/.test(expiry)) return 'Expiry must be MM/YY format';
        if (!cvv.trim() || cvv.length < 3) return 'Valid CVV is required';
        return null;
    };
    // Submit payment to backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        if (!order) {
            setError('Please fetch order details first');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            // Build request payload
            const paymentData = {
                orderId: order.id,
                amount: order.amount || 0,
                cardholderName: cardholderName.trim(),
                cardNumber: cardNumber.replace(/\s/g, ''),
                expiry: expiry.trim(),
                cvv: cvv.trim(),
                email: email.trim() || order.email
            };

            await axios.post(PAYMENTS_API, paymentData);

            // Showing success state and redirect
            setSuccess(true);
            setTimeout(() => {
                navigate('/orders');
            }, 2000);

        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Payment failed. Please try again.';
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    // Format card number as "XXXX XXXX XXXX XXXX"
    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\s/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted;
    };


    // Only allow digits and max length for card number
    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\s/g, '');
        if (/^\d*$/.test(value) && value.length <= 16) {
            setCardNumber(formatCardNumber(value));
        }
    };

    // Auto add "/" after MM for expiry input
    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        setExpiry(value);
    };

    // Only allow digits and max length for CVV
    const handleCvvChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            setCvv(value);
        }
    };

    // Success response UI
    if (success) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Alert severity="success" sx={{ maxWidth: 500 }}>
                    <Typography variant="h6">Payment Successful!</Typography>
                    <Typography>Redirecting to My Orders...</Typography>
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            {/* Back navigation */}
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')} sx={{ mb: 2 }}>
                Back to Orders
            </Button>

            {/* Page title */}
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                Payment
            </Typography>

            {/* Error message */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Order Details Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {/* If no order loaded, ask for Order ID */}
                        {!order ? (
                            <Box>
                                <TextField
                                    label="Order ID"
                                    fullWidth
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    margin="normal"
                                    type="number"
                                    helperText="Enter your Order ID to proceed"
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleFetchOrder}
                                    disabled={loading}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Fetch Order'}
                                </Button>
                            </Box>
                        ) : (
                            // Showing order summary
                            <Box>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Order ID:</strong> #{order.id}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Customer:</strong> {order.customerName}
                                </Typography>
                                <Typography variant="h5" color="secondary.main" sx={{ mt: 2 }}>
                                    <strong>Amount:</strong> {formatTRY(order.amount || 0)}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Payment Form Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            <LockIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                            Payment Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {/* Payment form */}
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Cardholder Name"
                                fullWidth
                                required
                                value={cardholderName}
                                onChange={(e) => setCardholderName(e.target.value)}
                                margin="normal"
                                disabled={!order || order.status === 'PAID'}
                            />

                            <TextField
                                label="Card Number"
                                fullWidth
                                required
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                margin="normal"
                                placeholder="1234 5678 9012 3456"
                                disabled={!order || order.status === 'PAID'}
                                inputProps={{ maxLength: 19 }}
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Expiry (MM/YY)"
                                        fullWidth
                                        required
                                        value={expiry}
                                        onChange={handleExpiryChange}
                                        margin="normal"
                                        placeholder="12/25"
                                        disabled={!order || order.status === 'PAID'}
                                        inputProps={{ maxLength: 5 }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="CVV"
                                        fullWidth
                                        required
                                        value={cvv}
                                        onChange={handleCvvChange}
                                        margin="normal"
                                        type="password"
                                        placeholder="123"
                                        disabled={!order || order.status === 'PAID'}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                label="Email (Optional)"
                                fullWidth
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                disabled={!order || order.status === 'PAID'}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                disabled={!order || submitting || order.status === 'PAID'}
                                sx={{ mt: 3 }}
                            >
                                {submitting ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    `Pay ${order ? formatTRY(order.amount || 0) : ''}`
                                )}
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Payment;
