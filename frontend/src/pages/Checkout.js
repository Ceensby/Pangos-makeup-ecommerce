import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { formatTRY } from '../utils/formatPrice';

const Checkout = () => {
  const { items, clear } = useCart();
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    address: '',
    creditCard: ''
  });
  const [orderId, setOrderId] = useState(null);

  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        ...formData,
        amount: cartTotal
      };
      const response = await axios.post('http://localhost:8080/api/orders', orderData);
      setOrderId(response.data.id);
      clear(); // Clear cart after successful order
    } catch (error) {
      console.error("Order failed", error);
    }
  };

  if (orderId) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" color="success.main">Order Confirmed!</Typography>
        <Typography variant="h6">Your Order ID is: #{orderId}</Typography>
        <Typography>Thank you for shopping with Pangos.</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth={600} mx="auto">
      <Typography variant="h4" mb={3}>Guest Checkout</Typography>

      {items.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">Your cart is empty</Typography>
          <Typography>Add items to cart before checkout.</Typography>
        </Paper>
      ) : (
        <>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            {items.map(item => (
              <Box key={item.id} display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">{item.name} × {item.quantity}</Typography>
                <Typography variant="body2">{formatTRY(item.price * item.quantity)}</Typography>
              </Box>
            ))}
            <Box display="flex" justifyContent="space-between" mt={2} pt={2} borderTop="1px solid #ddd">
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">{formatTRY(cartTotal)}</Typography>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth label="Full Name" name="customerName" margin="normal"
                required onChange={handleChange}
              />
              <TextField
                fullWidth label="Email" name="email" type="email" margin="normal"
                required onChange={handleChange}
              />
              <TextField
                fullWidth label="Shipping Address" name="address" margin="normal"
                multiline rows={3} required onChange={handleChange}
              />
              <TextField
                fullWidth label="Credit Card (Mock)" name="creditCard" margin="normal"
                required onChange={handleChange}
              />

              <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 3 }}>
                Place Order - {formatTRY(cartTotal)}
              </Button>
            </form>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Checkout;
