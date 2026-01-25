import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import { ChevronLeft, ChevronRight, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatTRY } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';

const ProductCarousel = ({ title, products }) => {
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();
    const { add } = useCart();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);

    // Scroll to exact card position (no drift/accumulation)
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const newIndex = direction === 'left'
                ? Math.max(0, currentIndex - 4)
                : Math.min(products.length - 4, currentIndex + 4);

            setCurrentIndex(newIndex);

            // Calculate exact scroll position based on card index
            const containerWidth = container.offsetWidth;
            const cardWidth = (containerWidth - 48) / 4; // Exact card width
            const gap = 16;
            const scrollPosition = newIndex * (cardWidth + gap);

            container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    };

    // Handle Add to Cart (prevent card click navigation)
    const handleAddToCart = (e, product) => {
        e.stopPropagation(); // Prevent card click
        add(product);
    };

    if (!products || products.length === 0) {
        console.log(`⚠️  ProductCarousel "${title}": No products to display`);
        return null;
    }

    console.log(`🎠 ProductCarousel "${title}": Rendering ${products.length} products`);

    // Render product card
    const renderProductCard = (product, index) => {
        const bgColor = index % 2 === 0 ? '#fce4ec' : '#e8f5e9';

        return (
            <Card
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                    }
                }}
            >
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

                <CardContent sx={{ pb: 1 }}>
                    <Typography
                        variant="h6"
                        component="div"
                        noWrap
                        sx={{ fontSize: '0.95rem', fontWeight: 600, mb: 0.5 }}
                    >
                        {product.name}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ mb: 1 }}
                    >
                        {product.description}
                    </Typography>

                    <Typography
                        variant="h6"
                        color="#e91e63"
                        fontWeight="bold"
                        sx={{ fontSize: '1.1rem' }}
                    >
                        {formatTRY(product.price)}
                    </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', pt: 0, pb: 1.5, px: 2 }}>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<ShoppingCart fontSize="small" />}
                        onClick={(e) => handleAddToCart(e, product)}
                        sx={{
                            bgcolor: '#4caf50',
                            color: 'white',
                            fontSize: '0.75rem',
                            py: 0.5,
                            px: 1.5,
                            '&:hover': {
                                bgcolor: '#388e3c'
                            }
                        }}
                    >
                        Add
                    </Button>
                </CardActions>
            </Card>
        );
    };

    return (
        <Box sx={{ mb: 6 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary.main"
                    sx={{ fontFamily: '"Playfair Display", serif' }}
                >
                    {title}
                </Typography>

                {!expanded && (
                    <Box>
                        <IconButton
                            onClick={() => scroll('left')}
                            sx={{ bgcolor: '#e91e63', color: 'white', mr: 1, '&:hover': { bgcolor: '#c2185b' } }}
                        >
                            <ChevronLeft />
                        </IconButton>
                        <IconButton
                            onClick={() => scroll('right')}
                            sx={{ bgcolor: '#e91e63', color: 'white', '&:hover': { bgcolor: '#c2185b' } }}
                        >
                            <ChevronRight />
                        </IconButton>
                    </Box>
                )}
            </Box>

            {expanded ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                    {products.map((product, index) => renderProductCard(product, index))}
                </Box>
            ) : (
                <Box
                    ref={scrollContainerRef}
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: 2,
                        pb: 2,
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                        width: '100%',
                        maxWidth: '100%'
                    }}
                >
                    {products.map((product, index) => (
                        <Box
                            key={product.id}
                            sx={{
                                minWidth: 'calc((100% - 48px) / 4)',
                                maxWidth: 'calc((100% - 48px) / 4)',
                                width: 'calc((100% - 48px) / 4)',
                                flexShrink: 0
                            }}
                        >
                            {renderProductCard(product, index)}
                        </Box>
                    ))}
                </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    onClick={() => setExpanded(!expanded)}
                    sx={{
                        color: '#e91e63',
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                    }}
                >
                    {expanded ? 'Show Less' : 'See All Products →'}
                </Button>
            </Box>
        </Box>
    );
};

export default ProductCarousel;
