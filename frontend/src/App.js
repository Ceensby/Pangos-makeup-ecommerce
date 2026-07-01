// App.js - Main application component with routing and layout structure

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Snackbar, Alert, Typography, Drawer, useMediaQuery } from '@mui/material';
import theme from './theme';

// Layout Components
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import DemoBanner from './components/DemoBanner';

// Pages
import Home from './pages/Home';
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
import CreditCards from './pages/CreditCards';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import { useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
    const { items } = useCart();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [prevItemCount, setPrevItemCount] = useState(0);

    // Responsive breakpoints
    const isDesktop = useMediaQuery('(min-width:1024px)');
    const isTablet = useMediaQuery('(min-width:768px) and (max-width:1023px)');

    // Drawer state
    const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

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

    // Whether sidebars should be inline or in drawers
    const leftSidebarInline = isDesktop;
    const rightSidebarInline = isDesktop || isTablet;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* Demo Banner */}
                <DemoBanner />

                {/* Global Header with Search */}
                <Header
                    onMenuClick={() => setLeftDrawerOpen(true)}
                    onAccountClick={() => setRightDrawerOpen(true)}
                    showMenuButton={!leftSidebarInline}
                    showAccountButton={!rightSidebarInline}
                />

                <Box sx={{ display: 'flex', flexGrow: 1 }}>
                    {/* Left Sidebar - Desktop: inline */}
                    {leftSidebarInline && <LeftSidebar />}

                    {/* Left Sidebar - Tablet/Mobile: Drawer */}
                    {!leftSidebarInline && (
                        <Drawer
                            anchor="left"
                            open={leftDrawerOpen}
                            onClose={() => setLeftDrawerOpen(false)}
                            ModalProps={{ keepMounted: true }}
                            sx={{
                                '& .MuiDrawer-paper': {
                                    width: { xs: '100vw', sm: '90vw', md: 380 },
                                },
                            }}
                        >
                            <LeftSidebar onNavigate={() => setLeftDrawerOpen(false)} />
                        </Drawer>
                    )}

                    {/* Main Content Area - Page Routes */}
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: { xs: 1.5, sm: 2, md: 3 },
                            bgcolor: '#fff',
                            overflowX: 'hidden',
                            minWidth: 0,
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<ProductList />} />
                            <Route path="/products/:id" element={<ProductDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/orders" element={<MyOrders />} />
                            <Route path="/payment" element={<Payment />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/addresses" element={<Addresses />} />
                            <Route path="/credit-cards" element={<CreditCards />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/faq" element={<FAQ />} />
                        </Routes>
                    </Box>

                    {/* Right Sidebar - Desktop/Tablet: inline */}
                    {rightSidebarInline && <RightSidebar />}

                    {/* Right Sidebar - Mobile: Drawer */}
                    {!rightSidebarInline && (
                        <Drawer
                            anchor="right"
                            open={rightDrawerOpen}
                            onClose={() => setRightDrawerOpen(false)}
                            ModalProps={{ keepMounted: true }}
                            sx={{
                                '& .MuiDrawer-paper': {
                                    width: { xs: '100vw', sm: '90vw', md: 380 },
                                },
                            }}
                        >
                            <RightSidebar onNavigate={() => setRightDrawerOpen(false)} />
                        </Drawer>
                    )}
                </Box>
                
                {/* Footer Demo Disclaimer */}
                <Box component="footer" sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Pangos. This is a demonstration site. No real products are sold and no real payments are processed.
                    </Typography>
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
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
