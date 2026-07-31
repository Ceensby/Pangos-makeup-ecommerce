// src/pages/ProductDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { formatTRY } from "../utils/formatPrice";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CardMedia from "@mui/material/CardMedia";

export default function ProductDetail() {
  // Read product id from URL
  const { id } = useParams();
  // Cart context
  const { add } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch product details on mount or id change
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getProductById(id)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load product", err);
          setError(err?.message || "Error loading product");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);


  // Add product to cart
  const handleAddToCart = () => {
    if (!product) return;
    console.log("ProductDetail: Add to cart clicked", product);
    add(product);
  };


  // Loading state UI
  if (loading) {
    return (
      <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // Error state UI
  if (error || !product) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Could not load product.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left: Image Area*/}
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image={product.imageUrl ? (product.imageUrl.startsWith('/') ? product.imageUrl : `/${product.imageUrl}`) : ''}
            alt={product.name}
            sx={{
              width: "100%",
              maxHeight: 500,
              objectFit: "contain",
              borderRadius: 5
            }}
          />
        </Grid>

        {/* Right: Info */}
        <Grid item xs={12} md={6}>
          {/* 1) Product Name */}
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
            {product.name}
          </Typography>

          {/* 2) Price */}
          <Typography variant="h5" color="secondary.main" fontWeight="bold" sx={{ mb: 5 }}>
            {formatTRY(product.price)}
          </Typography>

          {/* 3) Add to Cart section */}
          <Box sx={{ mt: 6, mb: 6, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              sx={{ px: 4 }}
            >
              Add to Cart
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#4caf50',
                color: 'white',
                '&:hover': {
                  bgcolor: '#45a049'
                }
              }}
            >
              Back to Shopping
            </Button>
          </Box>

          {/* 4-5) Product Attributes from JSONB attributes column */}
          {product.attributes && typeof product.attributes === 'object' && Object.keys(product.attributes).length > 0 && (
            <Box sx={{ mt: 6, mb: 2 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: '#4caf50', mb: 2 }}
              >
                Product Attributes
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {Object.entries(product.attributes).map(([key, value], index) => {
                  const isEven = index % 2 === 0;
                  const pillBg = isEven ? '#d5f0d5' : '#ffd6e0';
                  const pillColor = isEven ? '#2e7d32' : '#c2185b';
                  // Format snake_case → Title Case
                  const label = key
                    .replace(/_/g, ' ')
                    .split(' ')
                    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                    .join(' ');
                  // Format value: booleans → Yes/No, rest as-is
                  let displayValue;
                  if (typeof value === 'boolean') {
                    displayValue = value ? 'Yes' : 'No';
                  } else {
                    displayValue = String(value);
                  }
                  return (
                    <Box
                      key={key}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          bgcolor: pillBg,
                          color: pillColor,
                          px: 1.75,
                          py: 0.5,
                          borderRadius: '16px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          display: 'inline-block',
                          minWidth: '100px',
                          textAlign: 'center',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {label}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, color: 'text.primary' }}
                      >
                        {displayValue}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* 6-7) Description heading (green) + description text */}
          {product.description && (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: '#4caf50', mb: 2 }} // Main green accent
              >
                Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: 'text.primary',
                  whiteSpace: 'pre-line'
                }}
              >
                {product.description}
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
