import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, TextField, Stepper, Step, StepLabel, Alert, Card, CardContent, Radio, Chip, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatTRY } from '../utils/formatPrice';
import { Home, CreditCard as CreditCardIcon } from '@mui/icons-material';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clear } = useCart();
  const { isAuthenticated } = useAuth();

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Saved card state
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [loadingSavedCards, setLoadingSavedCards] = useState(true);

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

  // Fetch saved addresses on mount and when returning from /addresses
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
      fetchSavedCards();
    }
  }, [isAuthenticated, location]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:8080/api/addresses/me');
      setAddresses(response.data);

      // Auto-select default address if available
      if (response.data.length > 0 && !selectedAddressId) {
        const defaultAddr = response.data.find(addr => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch addresses', err);
      setError('Failed to load addresses');
    } finally {
      setLoadingAddresses(false);
    }
  };

  const fetchSavedCards = async () => {
    setLoadingSavedCards(true);
    try {
      const response = await axios.get('http://localhost:8080/api/saved-cards/me');
      setSavedCards(response.data);

      // Auto-select default card if available
      if (response.data.length > 0 && !selectedCardId) {
        const defaultCard = response.data.find(card => card.isDefault);
        if (defaultCard) {
          setSelectedCardId(defaultCard.id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch saved cards', err);
    } finally {
      setLoadingSavedCards(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Validate current step before proceeding
  const validateStep = () => {
    setError('');

    if (activeStep === 1) {
      // Validate address selection
      if (!selectedAddressId) {
        setError('Please select a delivery address');
        return false;
      }
    }

    if (activeStep === 2) {
      // Validate payment - check if card is selected
      if (!selectedCardId && !formData.cardholderName) {
        setError('Please select a payment method or enter card details');
        return false;
      }

      // If using manual entry, validate fields
      if (!selectedCardId) {
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
      // Get selected address data
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      if (!selectedAddress) {
        setError('Selected address not found');
        return;
      }

      // Get payment data - either from saved card or manual entry
      let paymentData;
      if (selectedCardId) {
        // Using saved card
        const selectedCard = savedCards.find(card => card.id === selectedCardId);
        if (!selectedCard) {
          setError('Selected card not found');
          return;
        }
        paymentData = {
          cardholderName: selectedCard.cardholderName,
          cardNumber: `************${selectedCard.last4}`, // Placeholder
          expiryDate: `${selectedCard.expiryMonth}/${selectedCard.expiryYear}`,
          cvv: '***' // Placeholder
        };
      } else {
        // Using manual entry
        paymentData = {
          cardholderName: formData.cardholderName,
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        };
      }

      // Build checkout data with selected address details
      const checkoutData = {
        customerName: selectedAddress.fullName,
        phoneNumber: selectedAddress.phoneNumber,
        addressLine: selectedAddress.addressLine,
        city: selectedAddress.city,
        postalCode: selectedAddress.postalCode,
        // Payment info
        ...paymentData,
        amount: cartTotal,
        // Cart items for order item tracking
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
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

  // Step 2: Address Selection
  const renderAddressSelection = () => {
    if (loadingAddresses) {
      return (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </Paper>
      );
    }

    if (addresses.length === 0) {
      return (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main">
            Delivery Address
          </Typography>
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No saved addresses found.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please add a delivery address to continue with checkout.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/addresses', { state: { from: '/checkout' } })}
            >
              Go to Manage Addresses
            </Button>
          </Box>
        </Paper>
      );
    }

    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main">
          Select Delivery Address
        </Typography>

        <Box sx={{ mt: 2 }}>
          {addresses.map((address) => (
            <Card
              key={address.id}
              sx={{
                mb: 2,
                cursor: 'pointer',
                border: selectedAddressId === address.id ? '2px solid' : '1px solid',
                borderColor: selectedAddressId === address.id ? 'primary.main' : 'divider',
                bgcolor: selectedAddressId === address.id ? 'action.selected' : 'background.paper',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => setSelectedAddressId(address.id)}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Radio
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                  sx={{ mt: -0.5 }}
                />
                <Box sx={{ flex: 1, ml: 1 }}>
                  {address.isDefault && (
                    <Chip
                      label="Default"
                      color="primary"
                      size="small"
                      icon={<Home />}
                      sx={{ mb: 1 }}
                    />
                  )}
                  <Typography variant="subtitle1" fontWeight="medium">
                    {address.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {address.phoneNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {address.addressLine}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {address.city}, {address.postalCode}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/addresses', { state: { from: '/checkout' } })}
            >
              Add New Address
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  };

  // Step 3: Payment Selection
  const renderPaymentSelection = () => {
    if (loadingSavedCards) {
      return (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </Paper>
      );
    }

    if (savedCards.length === 0) {
      return (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main">
            Payment Method
          </Typography>
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No saved credit cards found.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please add a payment method to continue with checkout.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/credit-cards', { state: { from: '/checkout' } })}
            >
              Go to Manage Credit Cards
            </Button>
          </Box>
        </Paper>
      );
    }

    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main">
          Select Payment Method
        </Typography>

        <Alert severity="info" sx={{ mb: 2, mt: 2 }}>
          This is a demo. Saved cards are used for checkout.
        </Alert>

        <Box sx={{ mt: 2 }}>
          {savedCards.map((card) => (
            <Card
              key={card.id}
              sx={{
                mb: 2,
                cursor: 'pointer',
                border: selectedCardId === card.id ? '2px solid' : '1px solid',
                borderColor: selectedCardId === card.id ? 'primary.main' : 'divider',
                bgcolor: selectedCardId === card.id ? 'action.selected' : 'background.paper',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => setSelectedCardId(card.id)}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Radio
                  checked={selectedCardId === card.id}
                  onChange={() => setSelectedCardId(card.id)}
                  sx={{ mt: -0.5 }}
                />
                <Box sx={{ flex: 1, ml: 1 }}>
                  {card.isDefault && (
                    <Chip
                      label="Default"
                      color="primary"
                      size="small"
                      icon={<CreditCardIcon />}
                      sx={{ mb: 1 }}
                    />
                  )}
                  <Typography variant="subtitle1" fontWeight="medium">
                    {card.cardholderName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {card.cardBrand || 'Card'}
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    •••• •••• •••• {card.last4}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Expires: {card.expiryMonth}/{card.expiryYear}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/credit-cards', { state: { from: '/checkout' } })}
            >
              Add New Card
            </Button>
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
  };

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
      case 1: return renderAddressSelection();
      case 2: return renderPaymentSelection();
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
