import React from 'react';
import { Box, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const DemoBanner = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#ff9800', // Orange warning color
        color: 'white',
        padding: { xs: '6px 10px', sm: '8px 16px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        zIndex: 1300, // Above typical navbars
        position: 'relative',
        flexWrap: 'wrap',
      }}
    >
      <WarningAmberIcon sx={{ mr: 1, fontSize: { xs: '1.1rem', sm: '1.5rem' } }} />
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
        This is a demonstration site. No real products are sold and no real payments are processed.
      </Typography>
    </Box>
  );
};

export default DemoBanner;
