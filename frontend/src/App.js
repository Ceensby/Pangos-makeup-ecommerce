
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
import { useCart } from './context/CartContext';

function App() {
    const { items } = useCart();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [prevItemCount, setPrevItemCount] = useState(0);

    useEffect(() => {
        if (items.length > prevItemCount) {
            setOpenSnackbar(true);
        }
        setPrevItemCount(items.length);
    }, [items, prevItemCount]);

    const handleCloseSnackbar = () => setOpenSnackbar(false);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* Global Header with Search */}
                <Header />

                <Box sx={{ display: 'flex', flexGrow: 1 }}>
                    {/* Left Sidebar */}
                    <LeftSidebar />

                    {/* Main Content Area */}
                    <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#fff', overflowX: 'hidden' }}>
                        <Routes>
                            <Route path="/" element={<ProductList />} />
                            <Route path="/products/:id" element={<ProductDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/orders" element={<MyOrders />} />
                            <Route path="/payment" element={<Payment />} />
                        </Routes>
                    </Box>

                    {/* Right Sidebar */}
                    <RightSidebar />

                    <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                            Item added to cart!
                        </Alert>
                    </Snackbar>

                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;

