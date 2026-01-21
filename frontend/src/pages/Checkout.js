import React, { useState } from 'react';
import { Box, Typography, Button, Paper, TextField, Stepper, Step, StepLabel, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatTRY } from '../utils/formatPrice';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clear } = useCart();
  const { isAuthenticated } = useAuth();

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');

  // Form data for all steps
  const [formData, setFormData] = useState({
    // Address info
    customerName: '',
    phoneNumber: '',
    addressLine: '',
    city: '',
    postalCode: '',
    // Payment info
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const steps = ['Order Summary', 'Address Information', 'Payment Details', 'Confirmation'];

  // Calculate total amount from cart items
  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Validate current step before proceeding
  const validateStep = () => {
    setError('');

    if (activeStep === 1) {
      // Validate address information
      if (!formData.customerName || !formData.phoneNumber || !formData.addressLine ||
        !formData.city || !formData.postalCode) {
        setError('Please fill in all address fields');
        return false;
      }
    }

    if (activeStep === 2) {
      // Validate payment information
      if (!formData.cardholderName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        setError('Please fill in all payment fields');
        return false;
      }
      // Basic card number validation (remove spaces, check length)
      const cardNum = formData.cardNumber.replace(/\s/g, '');
      if (cardNum.length < 13 || cardNum.length > 19) {
        setError('Please enter a valid card number');
        return false;
      }
      // CVV validation
      if (formData.cvv.length < 3 || formData.cvv.length > 4) {
        setError('Please enter a valid CVV');
        return false;
      }
    }

    return true;
  };

  // Handle next step
  const handleNext = async () => {
    if (!validateStep()) {
      return;
    }

    // If on payment step, submit the order
    if (activeStep === 2) {
      await handleOrderSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  // Submit order to backend
  const handleOrderSubmit = async () => {
    try {
      const checkoutData = {
        ...formData,
        amount: cartTotal
      };

      const response = await axios.post('http://localhost:8080/api/checkout/complete', checkoutData);

      if (response.data.success) {
        // Save order ID
        setOrderId(response.data.orderId);

        // Clear cart
        clear();

        // Move to confirmation step
        setActiveStep(3);
      } else {
        setError('Order failed. Please try again.');
      }
    } catch (err) {
      console.error('Order submission failed', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Please login to complete checkout');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Failed to place order. Please try again.');
      }
    }
  };

  // Check authentication
  if (!isAuthenticated) {
    return (
      <Box maxWidth={800} mx="auto" mt={5}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Please login to checkout
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            You need to be logged in to complete your purchase.
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

  // Empty cart check
  if (items.length === 0 && !orderId) {
    return (
      <Box maxWidth={800} mx="auto" mt={5}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Add items to cart before checkout.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Browse Products
          </Button>
        </Paper>
      </Box>
    );
  }

  // Step 1: Order Summary
  const renderOrderSummary = () => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main">
        Review Your Order
      </Typography>

      {items.map((item) => (
        <Box key={item.id} display="flex" justifyContent="space-between" py={1.5} borderBottom="1px solid #f0f0f0">
          <Box>
            <Typography variant="body1" fontWeight="medium">{item.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Quantity: {item.quantity} × {formatTRY(item.price)}
            </Typography>
          </Box>
          <Typography variant="body1" fontWeight="bold">
            {formatTRY(item.price * item.quantity)}
          </Typography>
        </Box>
      ))}

      <Box display="flex" justifyContent="space-between" mt={3} pt={2} borderTop="2px solid #ddd">
        <Typography variant="h6" fontWeight="bold">Total:</Typography>
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          {formatTRY(cartTotal)}
        </Typography>
      </Box>
    </Paper>
  );

  // Step 2: Address Information
  const renderAddressForm = () => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main">
        Delivery Address
      </Typography>

      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Full Name"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Address Line"
          name="addressLine"
          value={formData.addressLine}
          onChange={handleChange}
          margin="normal"
          required
          multiline
          rows={2}
        />
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            margin="normal"
            required
          />
        </Box>
      </Box>
    </Paper>
  );

  // Step 3: Payment Information
  const renderPaymentForm = () => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main">
        Payment Details
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        This is a demo. Use test card: 4242 4242 4242 4242
      </Alert>

      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Cardholder Name"
          name="cardholderName"
          value={formData.cardholderName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Card Number"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          margin="normal"
          required
          placeholder="1234 5678 9012 3456"
        />
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="Expiry Date (MM/YY)"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            margin="normal"
            required
            placeholder="12/25"
          />
          <TextField
            fullWidth
            label="CVV"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            margin="normal"
            required
            placeholder="123"
            inputProps={{ maxLength: 4 }}
          />
        </Box>
      </Box>

      {/* Order summary in payment step */}
      <Box mt={3} p={2} bgcolor="#f9f9f9" borderRadius={1}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Order Total
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          {formatTRY(cartTotal)}
        </Typography>
      </Box>
    </Paper>
  );

  // Step 4: Confirmation
  const renderConfirmation = () => (
    <Box textAlign="center" mt={3}>
      <Box sx={{ fontSize: 64, mb: 2 }}>✓</Box>
      <Typography variant="h4" color="success.main" gutterBottom fontWeight="bold">
        Order Confirmed!
      </Typography>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Your Order ID is: <strong>#{orderId}</strong>
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Thank you for shopping with Pangos. Your order has been successfully placed!
      </Typography>

      <Box display="flex" gap={2} justifyContent="center">
        <Button variant="outlined" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
        <Button variant="contained" onClick={() => navigate('/orders')}>
          View My Orders
        </Button>
      </Box>
    </Box>
  );

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0: return renderOrderSummary();
      case 1: return renderAddressForm();
      case 2: return renderPaymentForm();
      case 3: return renderConfirmation();
      default: return null;
    }
  };

  return (
    <Box maxWidth={800} mx="auto">
      <Typography variant="h4" mb={3} fontWeight="bold" color="primary.main">
        Checkout
      </Typography>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Step content */}
      {renderStepContent(activeStep)}

      {/* Navigation buttons */}
      {activeStep < 3 && (
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            size="large"
          >
            {activeStep === 2 ? `Place Order - ${formatTRY(cartTotal)}` : 'Continue'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Checkout;
