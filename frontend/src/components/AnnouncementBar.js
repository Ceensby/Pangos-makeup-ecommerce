// AnnouncementBar.js - Infinite scrolling promotional banner (center content only)

import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// True infinite scroll animation - seamless loop
const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const BarContainer = styled(Box)({
    width: 'calc(100% + 48px)', // Extend beyond container padding (24px left + 24px right)
    backgroundColor: '#81c784', // Light green
    overflow: 'hidden',
    padding: '8px 0', // Slim, elegant bar
    position: 'relative',
    whiteSpace: 'nowrap',
    marginTop: '-24px', // Pull up to attach flush with header
    marginBottom: '24px', // Restore spacing below bar
    marginLeft: '-24px', // Extend left to touch left sidebar
    marginRight: '-24px', // Extend right to touch right sidebar
});

const ScrollingContent = styled(Box)({
    display: 'inline-block',
    animation: `${scroll} 125s linear infinite`, // 50% slower (62.5s * 2) - calm, luxury motion
    willChange: 'transform',
});

const MessageText = styled(Typography)({
    display: 'inline-block',
    color: '#ffffff !important', // Force white color
    fontSize: '0.9rem',
    fontWeight: '500 !important', // Medium weight for visibility
    fontFamily: '"Poppins", "Montserrat", "Inter", -apple-system, sans-serif !important', // Force font override
    letterSpacing: '0.5px !important', // Increased for clarity
    padding: '0 28px',
    textRendering: 'optimizeLegibility', // Better font rendering
    WebkitFontSmoothing: 'antialiased', // Smooth font on webkit
    '@media (max-width: 600px)': {
        fontSize: '0.8rem',
        padding: '0 20px',
    },
});

function AnnouncementBar() {
    // Fixed promotional messages in exact order
    const messages = [
        'Buy 3 Get 1 Free ✨',
        'Glow Up Your Routine 💚',
        'Discover: New Arrivals 🌸',
        'Your Daily Beauty Upgrade 💄',
        'Free Shipping on Orders Over ₺2350 💚'
    ];

    // Quadruple the messages for seamless infinite loop
    const repeatedMessages = [...messages, ...messages, ...messages, ...messages];

    return (
        <BarContainer>
            <ScrollingContent>
                {repeatedMessages.map((message, index) => (
                    <MessageText key={index} component="span">
                        {message}
                    </MessageText>
                ))}
            </ScrollingContent>
        </BarContainer>
    );
}

export default AnnouncementBar;
