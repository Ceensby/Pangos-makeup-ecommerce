// ProductQuickViewPanel.js - Side drawer panel displaying detailed product information

import React from 'react';
import {
    Drawer, Box,
    Typography,
    IconButton,
    Divider,
    CircularProgress,
    Chip,
    Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatTRY } from '../utils/formatPrice';

function ProductQuickViewPanel({ open, onClose, product, loading }) {
    if (!open) return null;

    // Convert specification keys from snake_case to Title Case (battery_life -> Battery Life)
    const formatSpecKey = (key) => {
        return key
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    // Render product specifications with smart formatting
    const renderDetails = (details) => {
        if (!details) return <Typography color="text.secondary">No details available.</Typography>;

        // Try parsing JSON string
        let parsedDetails = details;
        if (typeof details === 'string') {
            try {
                parsedDetails = JSON.parse(details);
            } catch {
                return <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{details}</Typography>;
            }
        }

        // Render object as key-value chips (alternating green/pink colors)
        if (typeof parsedDetails === 'object' && !Array.isArray(parsedDetails)) {
            return (
                <Stack spacing={1.5}>
                    {Object.entries(parsedDetails).map(([key, value], index) => (
                        <Box key={key} display="flex" alignItems="center" gap={1.5}>
                            <Chip
                                label={formatSpecKey(key)}
                                size="small"
                                color={index % 2 === 0 ? 'success' : 'secondary'}
                                sx={{
                                    minWidth: 120,
                                    fontWeight: 600,
                                    cursor: 'default'
                                }}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    fontStyle: 'italic',
                                    fontFamily: '"Georgia", serif',
                                    color: 'text.secondary'
                                }}
                            >
                                {String(value)}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            );
        }

        // Render array as bullet list
        if (Array.isArray(parsedDetails)) {
            return (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {parsedDetails.map((item, index) => (
                        <li key={index}>
                            <Typography variant="body2">{String(item)}</Typography>
                        </li>
                    ))}
                </ul>
            );
        }

        return <Typography color="text.secondary">Invalid details format.</Typography>;
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: { xs: '100%', sm: 400 },
                    p: 3
                }
            }}
        >
            <Box>
                {/* Header with close button */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                        Product Details
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Loading state */}
                {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                    </Box>
                ) : product ? (
                    <Box>
                        {/* Product Image */}
                        {product.imageUrl && (
                            <Box
                                component="img"
                                src={product.imageUrl}
                                alt={product.name}
                                sx={{
                                    width: '100%',
                                    height: 200,
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                    mb: 2
                                }}
                            />
                        )}

                        {/* Product Name */}
                        <Typography variant="h6" gutterBottom>
                            {product.name}
                        </Typography>

                        {/* Price */}
                        <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
                            {formatTRY(product.price)}
                        </Typography>

                        {/* Category/Brand Chips */}
                        {(product.mainCategory || product.brand) && (
                            <Box mb={2}>
                                {product.mainCategory && (
                                    <Chip label={product.mainCategory} size="small" sx={{ mr: 1 }} />
                                )}
                                {product.brand && (
                                    <Chip label={product.brand} size="small" variant="outlined" />
                                )}
                            </Box>
                        )}

                        <Divider sx={{ my: 2 }} />

                        {/* Description Section */}
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                            Description
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            {product.description || 'No description available.'}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {/* Specifications Section */}
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                            Specifications
                        </Typography>
                        {renderDetails(product.details)}
                    </Box>
                ) : (
                    <Typography color="error">Failed to load product details.</Typography>
                )}
            </Box>
        </Drawer>
    );
}

export default ProductQuickViewPanel;
