import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCarousel from '../components/ProductCarousel';
import AnnouncementBar from '../components/AnnouncementBar';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_BASE = `${API_BASE_URL}/products`;

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';

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
      <Box>
        {/* Same flow as ProductList — do not wrap AnnouncementBar in overflow:hidden */}
        <AnnouncementBar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <AnnouncementBar />
        <Box textAlign="center" py={5}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Client-side search filtering for Home page
  const filterByQuery = (products) => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(product =>
      (product.name && product.name.toLowerCase().includes(q)) ||
      (product.description && product.description.toLowerCase().includes(q)) ||
      (product.brand && product.brand.toLowerCase().includes(q))
    );
  };

  const filteredAll = filterByQuery(allProducts);
  const filteredFeatured = filterByQuery(featuredProducts);
  const isSearching = searchQuery.trim().length > 0;

  return (
    <Box>
      {/* Match ProductList: bar in normal document flow (negative margins must not be clipped) */}
      <AnnouncementBar />

      {/* Carousel overflow containment stays below the bar so the strip is never cut */}
      <Box sx={{ pb: 3, minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
        {/* Search results header */}
        {isSearching && (
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              Search results for "{searchQuery}"
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ textTransform: 'none' }}
            >
              Clear search
            </Button>
          </Box>
        )}

        {/* New Arrivals - Randomized */}
        <ProductCarousel
          title={isSearching ? 'Matching Products' : 'New Arrivals'}
          products={filteredAll}
        />

        {/* Featured Now - Filtered by featured=true */}
        {filteredFeatured.length > 0 && (
          <ProductCarousel
            title={isSearching ? 'Matching Featured' : 'Featured Now'}
            products={filteredFeatured}
          />
        )}

        {/* No results message */}
        {isSearching && filteredAll.length === 0 && filteredFeatured.length === 0 && (
          <Box textAlign="center" py={5}>
            <Typography variant="h6" color="text.secondary">
              No products found matching "{searchQuery}"
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
