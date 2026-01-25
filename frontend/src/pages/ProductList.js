import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, Chip } from '@mui/material';
import { formatTRY } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import AnnouncementBar from '../components/AnnouncementBar';

// Backend API base URL
const API_URL = 'http://localhost:8080/api/products';



const ProductList = () => {
    // Product list state
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // Cart context
    const { add } = useCart();

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

    // Navigate to product detail page
    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
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
                        {(showAll ? products : products.slice(0, 16)).map((product, index) => {
                            // Calculate alternating background color (same as ProductCarousel)
                            const bgColor = index % 2 === 0 ? '#fce4ec' : '#e8f5e9';

                            return (
                                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                boxShadow: 4,
                                                transform: 'translateY(-4px)',
                                                transition: 'all 0.3s ease'
                                            }
                                        }}
                                        onClick={() => handleProductClick(product.id)}
                                    >

                                        {/* Product image with colored background (matching ProductCarousel) */}
                                        <Box
                                            sx={{
                                                height: 220,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {/* Colored background box */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    bottom: 0,
                                                    left: '10%',
                                                    right: '10%',
                                                    bgcolor: bgColor,
                                                    borderRadius: 2
                                                }}
                                            />

                                            {/* Product image on top of colored background */}
                                            <CardMedia
                                                component="img"
                                                image={product.imageUrl || 'https://via.placeholder.com/200?text=No+Image'}
                                                alt={product.name}
                                                sx={{
                                                    objectFit: 'contain',
                                                    height: '90%',
                                                    width: '90%',
                                                    position: 'relative',
                                                    zIndex: 1,
                                                    borderRadius: 3
                                                }}
                                            />
                                        </Box>
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
                                        <CardActions sx={{ justifyContent: 'flex-end', px: 2 }}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="secondary"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent card click when clicking Add to Cart
                                                    add(product);
                                                }}
                                            >
                                                Add to Cart
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })}
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
        </Box>
    );
};

export default ProductList;
