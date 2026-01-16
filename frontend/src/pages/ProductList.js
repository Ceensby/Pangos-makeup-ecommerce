import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, Chip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { formatTRY } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import ProductQuickViewPanel from '../components/ProductQuickViewPanel';
import AnnouncementBar from '../components/AnnouncementBar';

// Backend API base URL
const API_URL = 'http://localhost:8080/api/products';



const ProductList = () => {
    // Product list state
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    // Cart context
    const { add } = useCart();

    // Quick view panel state
    const [panelOpen, setPanelOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [panelLoading, setPanelLoading] = useState(false);

    // Product display limit state (show 16 initially)
    const [showAll, setShowAll] = useState(false);

    // Query parameters
    const mainCategory = searchParams.get('mainCategory');
    const subCategory = searchParams.get('subCategory');
    const searchQuery = searchParams.get('q');

    // Fetch products when filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = API_URL;
                const params = new URLSearchParams();
                if (mainCategory) params.append('mainCategory', mainCategory);
                if (subCategory) params.append('subCategory', subCategory);
                if (searchQuery) params.append('q', searchQuery);

                if ([...params].length > 0) {
                    url += `?${params.toString()}`;
                }

                const response = await axios.get(url);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [mainCategory, subCategory, searchQuery]);

    // Fetch single product details for view
    const fetchProductDetails = async (productId) => {
        setPanelLoading(true);
        try {
            const response = await axios.get(`${API_URL}/${productId}`);
            setSelectedProduct(response.data);
        } catch (error) {
            console.error('Error fetching product details:', error);
            setSelectedProduct(null);
        } finally {
            setPanelLoading(false);
        }
    };

    // Open quick view panel
    const handleProductClick = (product) => {
        setPanelOpen(true);
        fetchProductDetails(product.id);
    };
    // Close quick view panel
    const handlePanelClose = () => {
        setPanelOpen(false);
        setSelectedProduct(null);
    };

    // Page title based on category
    const title = subCategory
        ? `${mainCategory} - ${subCategory}`
        : (mainCategory || "New Arrivals");

    return (
        <Box>
            {/* Promotional announcement bar - center content only */}
            <AnnouncementBar />

            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                {title}
            </Typography>


            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <>
                    <Grid container spacing={2}>
                        {/* Display limited products or all based on showAll state */}
                        {(showAll ? products : products.slice(0, 16)).map((product) => (
                            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

                                    {/* Product image */}
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={product.imageUrl || 'https://via.placeholder.com/200?text=No+Image'}
                                        alt={product.name}
                                        sx={{ objectFit: 'contain', p: 1 }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>

                                        {/* Product info */}
                                        <Typography variant="h6" component="div" noWrap>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {product.brand}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                            {formatTRY(product.price)}
                                        </Typography>
                                        {product.mainCategory && (
                                            <Chip label={product.mainCategory} size="small" sx={{ mt: 1 }} />
                                        )}
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleProductClick(product)}
                                            title="View Details"
                                        >
                                            <InfoIcon />
                                        </IconButton>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                add(product);
                                            }}
                                        >
                                            Add to Cart
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                        {products.length === 0 && (
                            <Typography sx={{ mt: 2 }}>No products found in this category.</Typography>
                        )}
                    </Grid>

                    {/* See More / Show Less Button */}
                    {products.length > 16 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => setShowAll(!showAll)}
                                sx={{
                                    borderRadius: '24px',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    borderWidth: '2px',
                                    '&:hover': {
                                        borderWidth: '2px',
                                        backgroundColor: 'rgba(233, 30, 99, 0.04)'
                                    }
                                }}
                            >
                                {showAll ? 'Show Less' : 'See More Products'}
                            </Button>
                        </Box>
                    )}
                </>
            )}

            {/* Product Quick View Panel */}
            <ProductQuickViewPanel
                open={panelOpen}
                onClose={handlePanelClose}
                product={selectedProduct}
                loading={panelLoading}
            />
        </Box>
    );
};

export default ProductList;
