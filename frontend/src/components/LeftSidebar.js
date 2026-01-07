// LeftSidebar.js - Category navigation sidebar for filtering products

import React from 'react';
import { Box, List, ListItemButton, ListItemText, ListSubheader, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Product categories and subcategories
const categories = {
    "Makeup": ["Eyeshadow", "Eyeliner", "Blush", "Highlighter", "Lipstick"],
    "Skincare": ["Moisturizer", "Serum", "SunCreams"],
    "Haircare": ["HairMask", "Oils", "HairWax"],
    "SpecialSets": ["MakeupSets", "SetsForGifts"]
};

const sidebarBg = '#ffeef5'; // Light pink background

const LeftSidebar = () => {
    const navigate = useNavigate();

    // Navigate to home with category filter params
    const handleCategoryClick = (main, sub) => {
        navigate(`/?mainCategory=${main}&subCategory=${sub}`);
    };

    return (
        <Box sx={{ width: 300, bgcolor: sidebarBg, minHeight: '100vh', padding: 2, borderRight: '1px solid #ffccde' }}>
            <List subheader={<ListSubheader sx={{ bgcolor: 'transparent', fontWeight: 'bold' }}>CATEGORIES</ListSubheader>}>
                {/* Render each category with subcategories */}
                {Object.entries(categories).map(([main, subs]) => (
                    <Box key={main}>
                        <ListItemText primary={main} sx={{ pl: 2, fontWeight: 'bold', color: '#880e4f' }} />
                        {subs.map((sub) => (
                            <ListItemButton key={sub} onClick={() => handleCategoryClick(main, sub)} sx={{ pl: 4 }}>
                                <ListItemText primary={sub} />
                            </ListItemButton>
                        ))}
                        <Divider variant="middle" sx={{ my: 1 }} />
                    </Box>
                ))}
            </List>
        </Box>
    );
};

export default LeftSidebar;
