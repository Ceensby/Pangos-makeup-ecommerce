import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import ProductCarousel from '../components/ProductCarousel';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/products';

// Utility function to shuffle array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Home() {
  console.log('🏠 Home component rendering...');
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch all products for "New Arrivals"
        const allResponse = await axios.get(API_BASE);
        console.log('📦 All products fetched:', allResponse.data.length);
        const shuffledAll = shuffleArray(allResponse.data);
        setAllProducts(shuffledAll);

        // Fetch featured products for "Featured Now"
        const featuredResponse = await axios.get(`${API_BASE}/featured`);
        console.log('⭐ Featured products fetched:', featuredResponse.data.length);
        setFeaturedProducts(featuredResponse.data);

      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={5}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      {/* New Arrivals - Randomized */}
      <ProductCarousel
        title="New Arrivals"
        products={allProducts}
      />

      {/* Featured Now - Filtered by featured=true */}
      {featuredProducts.length > 0 && (
        <ProductCarousel
          title="Featured Now"
          products={featuredProducts}
        />
      )}
    </Box>
  );
}
