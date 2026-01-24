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

// Light pink background
const sidebarBg = '#ffeef5';

const LeftSidebar = () => {
    //Navigation Helper
    const navigate = useNavigate();

    // Navigate to home with category filters
    const handleCategoryClick = (main, sub) => {
        navigate(`/?mainCategory=${main}&subCategory=${sub}`);
    };

    return (
        <Box sx={{ width: 300, bgcolor: sidebarBg, minHeight: '100vh', padding: 2, borderRight: '1px solid #ffccde' }}>

            {/* Category list */}
            <List subheader={<ListSubheader sx={{ bgcolor: 'transparent', fontWeight: 'bold', color: '#c2185b', fontFamily: 'Poppins, serif', fontSize: 'calc(1.2rem + 3px)' }}>Categories</ListSubheader>}>

                {/* Render each category with subcategories */}
                {Object.entries(categories).map(([main, subs]) => (
                    <Box key={main}>
                        <ListItemText primary={main} sx={{ pl: 2, fontWeight: 'bold', color: '#880e4f' }} />

                        {/* Subcategory buttons */}
                        {subs.map((sub) => (
                            <ListItemButton key={sub} onClick={() => handleCategoryClick(main, sub)} sx={{ pl: 4 }}>
                                <ListItemText primary={sub} />
                            </ListItemButton>
                        ))}

                        {/* Separator for easy looking content */}
                        <Divider variant="middle" sx={{ my: 1 }} />
                    </Box>
                ))}
            </List>
        </Box>
    );
};

export default LeftSidebar;
