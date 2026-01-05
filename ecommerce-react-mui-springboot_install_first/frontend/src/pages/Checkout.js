import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';

const Checkout = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    address: '',
    creditCard: ''
  });
  const [orderId, setOrderId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/orders', formData);
      setOrderId(response.data.id);
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
            Place Order
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Checkout;
