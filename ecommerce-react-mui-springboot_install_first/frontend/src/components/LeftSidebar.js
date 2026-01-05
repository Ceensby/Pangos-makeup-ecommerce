import React from 'react';
import { Box, List, ListItemButton, ListItemText, ListSubheader, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const categories = {
    "Makeup": ["Eyeshadow", "Eyeliner", "Blush", "Highlighter", "Lipstick"],
    "Skincare": ["Moisturizer", "Serum", "SunCreams"],
    "Haircare": ["HairMask", "Oils", "HairWax"],
    "SpecialSets": ["MakeupSets", "SetsForGifts"]
};

// Colors for sidebar
const sidebarBg = '#ffeef5'; // Light pinkish

const LeftSidebar = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (main, sub) => {
        navigate(`/?mainCategory=${main}&subCategory=${sub}`);
    };

    return (
        <Box sx={{ width: 240, bgcolor: sidebarBg, minHeight: '100vh', padding: 2, borderRight: '1px solid #ffccde' }}>
            <List subheader={<ListSubheader sx={{ bgcolor: 'transparent', fontWeight: 'bold' }}>CATEGORIES</ListSubheader>}>
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
