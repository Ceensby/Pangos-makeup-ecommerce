import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export default function FAQ() {
    return (
        <Container maxWidth="md">
            <Box sx={{ py: 4 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        mb: 3
                    }}
                >
                    FAQ
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    FAQ content will be added soon.
                </Typography>
            </Box>
        </Container>
    );
}
