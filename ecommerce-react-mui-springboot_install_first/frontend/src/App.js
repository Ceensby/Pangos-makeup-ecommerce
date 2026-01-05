import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';

// Layout Components
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';

// Pages
import ProductList from './pages/ProductList';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Box sx={{ display: 'flex', minHeight: '100vh' }}>

                {/* Left Sidebar */}
                <LeftSidebar />

                {/* Main Content Area */}
                <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#fff' }}>
                    <Routes>
                        <Route path="/" element={<ProductList />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                    </Routes>
                </Box>

                {/* Right Sidebar */}
                <RightSidebar />

            </Box>
        </ThemeProvider>
    );
}

export default App;

