// App.js - Main application component with routing and layout structure

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Snackbar, Alert } from '@mui/material';
import theme from './theme';

// Layout Components
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';

// Pages
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Addresses from './pages/Addresses';
import { useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
    const { items } = useCart();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [prevItemCount, setPrevItemCount] = useState(0);

    // Show notification when items are added to cart
    useEffect(() => {
        if (items.length > prevItemCount) {
            setOpenSnackbar(true);
        }
        setPrevItemCount(items.length);
    }, [items, prevItemCount]);

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    {/* Global Header with Search */}
                    <Header />

                    <Box sx={{ display: 'flex', flexGrow: 1 }}>
                        {/* Left Sidebar - Category Navigation */}
                        <LeftSidebar />

                        {/* Main Content Area - Page Routes */}
                        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#fff', overflowX: 'hidden' }}>
                            <Routes>
                                <Route path="/" element={<ProductList />} />
                                <Route path="/products/:id" element={<ProductDetail />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/orders" element={<MyOrders />} />
                                <Route path="/payment" element={<Payment />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/addresses" element={<Addresses />} />
                            </Routes>
                        </Box>

                        {/* Right Sidebar - Cart Preview */}
                        <RightSidebar />
                    </Box>
                </Box>

                {/* Cart notification snackbar */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={handleSnackbarClose} severity="success">
                        Item added to cart!
                    </Alert>
                </Snackbar>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
