// src/pages/ProductDetail.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
          console.log("Loaded product", data);
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
        {error && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {String(error)}
          </Typography>
        )}
        <Button variant="contained" component={Link} to="/">
          Back to Home
        </Button>
      </Container>
    );
  }



  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Sol: büyük resim */}
        <Grid item xs={12} md={5}>
          <CardMedia
            component="img"
            image={resolveImageUrl(product.imageUrl)}
            alt={product.name}
            sx={{
              width: "100%",
              maxHeight: 400,
              objectFit: "contain",
              borderRadius: 2,
              boxShadow: 1,
            }}
          />
        </Grid>

        {/* Sağ: bilgiler */}
        <Grid item xs={12} md={7}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom>
            {formatTRY(product.price)}
          </Typography>

          {product.description && (
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
          )}

          {product.details && (
            <Typography variant="body2" color="text.secondary" paragraph>
              {product.details}
            </Typography>
          )}

          <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => add(product)}
            >
              Add to cart
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/"
            >
              Back to Home
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
