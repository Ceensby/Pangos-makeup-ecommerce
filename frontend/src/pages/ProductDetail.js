// src/pages/ProductDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Divider from '@mui/material/Divider';
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../config";
import { formatTRY } from "../utils/formatPrice";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CardMedia from "@mui/material/CardMedia";

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleAddToCart = () => {
    if (!product) return;
    console.log("ProductDetail: Add to cart clicked", product);
    add(product);
    // Optional: Add local visual feedback if desired, 
    // but rely on Sidebar update for now as primary indicator.
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

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
        {/* Left: Image */}
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image={resolveImageUrl(product.imageUrl)}
            alt={product.name}
            sx={{
              width: "100%",
              maxHeight: 500,
              objectFit: "contain",
              borderRadius: 2,
              boxShadow: 1,
              bgcolor: '#f9f9f9'
            }}
          />
        </Grid>

        {/* Right: Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>

          <Typography variant="h5" color="secondary.main" fontWeight="bold" gutterBottom>
            {formatTRY(product.price)}
          </Typography>

          {product.description && (
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              {product.description}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          {product.details && (
            <Box sx={{ bgcolor: '#fff0f5', p: 2, borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold">Details:</Typography>
              <Typography variant="body2">{product.details}</Typography>
            </Box>
          )}

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
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
              variant="outlined"
              size="large"
              onClick={() => navigate('/')}
            >
              Back to Shopping
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
