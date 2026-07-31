// RightSidebar.js - Cart preview sidebar with user section and quick cart actions

import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Chip,
    Collapse,
    Divider,
    Fade,
    Grow,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatTRY } from '../utils/formatPrice';

const rightSidebarBg = '#e8f5e9';
const softShadow = '0 4px 16px rgba(46, 125, 50, 0.08)';
const REMOVE_ANIM_MS = 220;

const pressableSx = {
    transition: 'transform 160ms ease, background-color 180ms ease, box-shadow 180ms ease, color 180ms ease',
    '&:active': { transform: 'scale(0.97)' },
};

const menuItemSx = {
    borderRadius: 2,
    minHeight: 44,
    mb: 0.5,
    px: 1.25,
    transition: 'transform 180ms ease, background-color 180ms ease, color 180ms ease',
    '&:hover': {
        bgcolor: '#fce4ec',
        transform: 'translateX(4px)',
        '& .MuiSvgIcon-root': { color: '#e91e63' },
    },
    '&:active': { transform: 'translateX(2px) scale(0.98)' },
};

const pillButtonSx = {
    borderRadius: 20,
    minHeight: 44,
    textTransform: 'none',
    fontWeight: 600,
    ...pressableSx,
};

const sectionPaperSx = {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    bgcolor: '#ffffff',
    borderRadius: 4,
    boxShadow: softShadow,
    p: 1.75,
    border: '1px solid rgba(200, 230, 201, 0.7)',
};

/** Decorative botanical vine — dark green, low opacity, behind content */
const BotanicalPattern = () => (
    <Box
        aria-hidden
        sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            opacity: 0.1,
        }}
    >
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 300 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g fill="none" stroke="#2e7d32" strokeWidth="1.6" strokeLinecap="round">
                {/* Left climbing vine */}
                <path d="M18 40 C40 120, 8 200, 36 280 C60 350, 12 420, 40 500 C68 580, 20 660, 48 760 C60 820, 30 870, 42 900" />
                <path d="M8 160 C28 150, 42 168, 28 186 C14 176, 10 168, 8 160Z" fill="#388e3c" stroke="none" />
                <path d="M44 240 C64 228, 78 248, 62 266 C48 254, 42 248, 44 240Z" fill="#2e7d32" stroke="none" />
                <path d="M22 340 C42 328, 56 348, 40 366 C26 354, 20 348, 22 340Z" fill="#388e3c" stroke="none" />
                <path d="M48 450 C68 438, 82 458, 66 476 C52 464, 46 458, 48 450Z" fill="#2e7d32" stroke="none" />
                <path d="M26 560 C46 548, 60 568, 44 586 C30 574, 24 568, 26 560Z" fill="#388e3c" stroke="none" />
                <path d="M52 680 C72 668, 86 688, 70 706 C56 694, 50 688, 52 680Z" fill="#2e7d32" stroke="none" />
                {/* Right climbing vine */}
                <path d="M282 20 C250 110, 290 190, 255 270 C230 340, 285 410, 250 500 C220 580, 278 650, 245 740 C228 800, 270 860, 255 900" />
                <path d="M270 130 C250 118, 236 138, 252 156 C266 144, 272 138, 270 130Z" fill="#2e7d32" stroke="none" />
                <path d="M248 220 C228 208, 214 228, 230 246 C244 234, 250 228, 248 220Z" fill="#388e3c" stroke="none" />
                <path d="M272 330 C252 318, 238 338, 254 356 C268 344, 274 338, 272 330Z" fill="#2e7d32" stroke="none" />
                <path d="M242 430 C222 418, 208 438, 224 456 C238 444, 244 438, 242 430Z" fill="#388e3c" stroke="none" />
                <path d="M268 550 C248 538, 234 558, 250 576 C264 564, 270 558, 268 550Z" fill="#2e7d32" stroke="none" />
                <path d="M238 670 C218 658, 204 678, 220 696 C234 684, 240 678, 238 670Z" fill="#388e3c" stroke="none" />
                {/* Soft corner flourishes */}
                <path d="M120 30 C150 50, 170 40, 190 55" stroke="#388e3c" strokeWidth="1.2" />
                <path d="M155 48 C168 40, 182 52, 170 64 C158 56, 154 52, 155 48Z" fill="#2e7d32" stroke="none" />
                <path d="M110 860 C140 840, 180 855, 210 835" stroke="#388e3c" strokeWidth="1.2" />
                <path d="M165 848 C178 838, 192 850, 180 862 C168 854, 164 850, 165 848Z" fill="#2e7d32" stroke="none" />
            </g>
        </svg>
    </Box>
);

const RightSidebar = ({ onNavigate }) => {
    const navigate = useNavigate();
    const { items, remove } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [exitingIds, setExitingIds] = useState(() => new Set());

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = items.length;

    const capitalizeFirstLetter = (str) => {
        if (!str || typeof str !== 'string') return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const displayName = isAuthenticated
        ? capitalizeFirstLetter(user?.username) || 'User'
        : 'Guest';

    const getInitials = () => {
        if (!isAuthenticated) return null;
        const source = user?.fullName || user?.username || 'U';
        const parts = source.trim().split(/\s+/).filter(Boolean);
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return source.slice(0, 2).toUpperCase();
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        if (onNavigate) onNavigate();
    };

    const handleNav = (path) => {
        navigate(path);
        if (onNavigate) onNavigate();
    };

    const handleRemove = (id) => {
        if (exitingIds.has(id)) return;
        setExitingIds((prev) => new Set(prev).add(id));
        setTimeout(() => {
            remove(id);
            setExitingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }, REMOVE_ANIM_MS);
    };

    const profileImage = user?.profileImageUrl || user?.avatarUrl || user?.imageUrl || null;

    return (
        <Box
            sx={{
                position: 'relative',
                width: onNavigate ? '100%' : 270,
                maxWidth: onNavigate ? '100%' : 270,
                minWidth: onNavigate ? 0 : 270,
                flexShrink: 0,
                bgcolor: rightSidebarBg,
                backgroundImage: 'linear-gradient(180deg, #e8f5e9 0%, #f1f8f2 55%, #e8f5e9 100%)',
                minHeight: onNavigate ? '100%' : '100vh',
                height: '100%',
                padding: 2,
                borderLeft: onNavigate ? 'none' : '1px solid #c8e6c9',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                overflowX: 'hidden',
                overflowY: 'auto',
            }}
        >
            <BotanicalPattern />

            {/* Profile / guest hero */}
            <Fade in={mounted} timeout={280}>
                <Paper
                    elevation={0}
                    sx={{
                        ...sectionPaperSx,
                        position: 'relative',
                        zIndex: 1,
                        mb: 1.75,
                        pt: 2.75,
                        pb: 2.25,
                        px: 2,
                        textAlign: 'center',
                        background: 'linear-gradient(180deg, #ffffff 0%, #fafcfa 100%)',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                p: 0.6,
                                borderRadius: '50%',
                                background: isAuthenticated
                                    ? 'linear-gradient(145deg, #f8bbd0, #e91e63)'
                                    : 'linear-gradient(145deg, #c8e6c9, #81c784)',
                                boxShadow: isAuthenticated
                                    ? '0 8px 20px rgba(233, 30, 99, 0.22)'
                                    : '0 8px 20px rgba(76, 175, 80, 0.18)',
                            }}
                        >
                            <Avatar
                                src={isAuthenticated && profileImage ? profileImage : undefined}
                                sx={{
                                    width: 72,
                                    height: 72,
                                    bgcolor: isAuthenticated ? '#e91e63' : '#e8f5e9',
                                    color: isAuthenticated ? '#fff' : '#2e7d32',
                                    fontWeight: 700,
                                    fontSize: '1.45rem',
                                    border: '3px solid #ffffff',
                                    transition: 'transform 200ms ease',
                                    '&:hover': { transform: 'scale(1.04)' },
                                }}
                            >
                                {isAuthenticated
                                    ? getInitials()
                                    : <PersonOutlineIcon sx={{ fontSize: 38 }} />}
                            </Avatar>
                        </Box>

                        <Box sx={{ px: 0.5 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 700,
                                    mb: 0.35,
                                    fontSize: '1.15rem',
                                    lineHeight: 1.25,
                                }}
                            >
                                {displayName}
                            </Typography>
                            {isAuthenticated && user?.fullName && (
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary', fontSize: '0.88rem', mb: 0.5 }}
                                >
                                    {user.fullName}
                                </Typography>
                            )}
                            <Chip
                                size="small"
                                label={isAuthenticated ? 'Member' : 'Guest'}
                                sx={{
                                    mt: 0.25,
                                    height: 24,
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    bgcolor: isAuthenticated ? '#fce4ec' : '#e8f5e9',
                                    color: isAuthenticated ? '#e91e63' : '#2e7d32',
                                }}
                            />
                        </Box>
                    </Box>
                </Paper>
            </Fade>

            {/* Account card */}
            <Grow in={mounted} timeout={320} style={{ transitionDelay: mounted ? '60ms' : '0ms' }}>
                <Paper elevation={0} sx={{ ...sectionPaperSx, mb: 1.5 }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: '#2e7d32',
                            mb: 1.25,
                            fontWeight: 700,
                            letterSpacing: 0.3,
                            textTransform: 'uppercase',
                            fontSize: '0.7rem',
                            textAlign: 'center',
                        }}
                    >
                        Account
                    </Typography>

                    {!isAuthenticated ? (
                        <Box display="flex" flexDirection="column" gap={1.1} sx={{ px: 0.25 }}>
                            <Tooltip title="Sign in to your account" arrow>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="small"
                                    startIcon={<LoginIcon />}
                                    onClick={() => handleNav('/login')}
                                    sx={{
                                        ...pillButtonSx,
                                        bgcolor: '#e91e63',
                                        '&:hover': { bgcolor: '#c2185b' },
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Tooltip>
                            <Tooltip title="Create a new account" arrow>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    startIcon={<PersonAddAltIcon />}
                                    onClick={() => handleNav('/signup')}
                                    sx={{
                                        ...pillButtonSx,
                                        borderColor: '#e91e63',
                                        color: '#e91e63',
                                        '&:hover': {
                                            borderColor: '#c2185b',
                                            bgcolor: '#fce4ec',
                                        },
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </Tooltip>
                        </Box>
                    ) : (
                        <List dense disablePadding>
                            <ListItemButton onClick={() => handleNav('/profile')} sx={menuItemSx}>
                                <PersonIcon fontSize="small" sx={{ mr: 1.25, color: 'primary.main', transition: 'color 180ms ease' }} />
                                <ListItemText
                                    primary="Profile"
                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNav('/addresses')} sx={menuItemSx}>
                                <LocationOnIcon fontSize="small" sx={{ mr: 1.25, color: 'primary.main', transition: 'color 180ms ease' }} />
                                <ListItemText
                                    primary="Manage Addresses"
                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNav('/credit-cards')} sx={menuItemSx}>
                                <CreditCardIcon fontSize="small" sx={{ mr: 1.25, color: 'primary.main', transition: 'color 180ms ease' }} />
                                <ListItemText
                                    primary="Manage Credit Cards"
                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                />
                            </ListItemButton>
                        </List>
                    )}
                </Paper>
            </Grow>

            {/* Orders + logout */}
            <Grow in={mounted} timeout={340} style={{ transitionDelay: mounted ? '110ms' : '0ms' }}>
                <Box sx={{ position: 'relative', zIndex: 1, mb: 1.5 }}>
                    <Tooltip title="View your orders" arrow>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<ListAltIcon />}
                            onClick={() => handleNav('/orders')}
                            sx={{
                                ...pillButtonSx,
                                mb: isAuthenticated ? 1 : 0,
                                bgcolor: '#e91e63',
                                color: 'white',
                                '&:hover': { bgcolor: '#c2185b', boxShadow: '0 4px 12px rgba(233, 30, 99, 0.28)' },
                                fontSize: '0.875rem',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            My Orders
                        </Button>
                    </Tooltip>

                    {isAuthenticated && (
                        <Tooltip title="Sign out of your account" arrow>
                            <Button
                                fullWidth
                                variant="text"
                                startIcon={<LogoutIcon fontSize="small" />}
                                onClick={handleLogout}
                                sx={{
                                    ...pillButtonSx,
                                    color: 'error.main',
                                    fontSize: '0.875rem',
                                    justifyContent: 'flex-start',
                                    pl: 1.5,
                                    '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.06)' },
                                }}
                            >
                                Log Out
                            </Button>
                        </Tooltip>
                    )}
                </Box>
            </Grow>

            {/* Cart card */}
            <Grow in={mounted} timeout={360} style={{ transitionDelay: mounted ? '160ms' : '0ms' }}>
                <Paper
                    elevation={0}
                    sx={{
                        ...sectionPaperSx,
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: cartCount === 0 ? 0 : 1,
                        minHeight: 0,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 1.25,
                            gap: 1,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Badge
                                badgeContent={cartCount}
                                color="primary"
                                overlap="circular"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        bgcolor: '#e91e63',
                                        fontWeight: 700,
                                    },
                                }}
                            >
                                <ShoppingCartIcon sx={{ color: '#2e7d32' }} />
                            </Badge>
                            <Typography
                                variant="subtitle1"
                                sx={{ color: '#2e7d32', fontWeight: 700, lineHeight: 1.2 }}
                            >
                                Cart
                            </Typography>
                        </Box>
                        <Chip
                            size="small"
                            label={`${cartCount} item${cartCount === 1 ? '' : 's'}`}
                            sx={{
                                bgcolor: cartCount > 0 ? '#fce4ec' : '#e8f5e9',
                                color: cartCount > 0 ? '#e91e63' : '#2e7d32',
                                fontWeight: 600,
                                height: 26,
                            }}
                        />
                    </Box>

                    <Divider sx={{ mb: 1.25, borderColor: 'rgba(200, 230, 201, 0.9)' }} />

                    {cartCount === 0 ? (
                        <Fade in timeout={280}>
                            <Box
                                sx={{
                                    py: 3,
                                    px: 1,
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '50%',
                                        bgcolor: '#e8f5e9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 0.5,
                                    }}
                                >
                                    <ShoppingCartOutlinedIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                                </Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    Your cart is empty
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                    Add something lovely to get started
                                </Typography>
                            </Box>
                        </Fade>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                            <List dense disablePadding sx={{ maxHeight: 280, overflowY: 'auto', pr: 0.5 }}>
                                {items.map((item) => (
                                    <Collapse
                                        key={item.id}
                                        in={!exitingIds.has(item.id)}
                                        timeout={REMOVE_ANIM_MS}
                                        unmountOnExit
                                    >
                                        <ListItem
                                            disablePadding
                                            secondaryAction={
                                                <Tooltip title="Remove from cart" arrow>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        onClick={() => handleRemove(item.id)}
                                                        size="small"
                                                        sx={{
                                                            minWidth: 44,
                                                            minHeight: 44,
                                                            color: 'text.secondary',
                                                            transition: 'transform 160ms ease, color 160ms ease, background-color 160ms ease',
                                                            '&:hover': {
                                                                color: '#e91e63',
                                                                bgcolor: '#fce4ec',
                                                                transform: 'scale(1.08)',
                                                            },
                                                            '&:active': { transform: 'scale(0.94)' },
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                            sx={{
                                                mb: 0.75,
                                                pr: 6,
                                                borderRadius: 2,
                                                bgcolor: '#fafcfa',
                                                border: '1px solid rgba(232, 245, 233, 0.9)',
                                                transition: 'background-color 180ms ease, transform 180ms ease',
                                                '&:hover': {
                                                    bgcolor: '#fce4ec',
                                                    transform: 'translateX(2px)',
                                                },
                                            }}
                                        >
                                            <ListItemText
                                                primary={item.name}
                                                secondary={`${item.quantity} × ${formatTRY(item.price)}`}
                                                primaryTypographyProps={{
                                                    noWrap: true,
                                                    variant: 'body2',
                                                    fontWeight: 600,
                                                    sx: { pr: 0.5 },
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: 'caption',
                                                    sx: { color: '#e91e63', fontWeight: 500 },
                                                }}
                                                sx={{ my: 0.75, ml: 1.25 }}
                                            />
                                        </ListItem>
                                    </Collapse>
                                ))}
                            </List>

                            <Box sx={{ mt: 1.75 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'baseline',
                                        mb: 1.25,
                                        px: 0.25,
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                        Total
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                        sx={{ color: '#e91e63' }}
                                    >
                                        {formatTRY(cartTotal)}
                                    </Typography>
                                </Box>
                                <Tooltip title="Open full cart" arrow>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={() => handleNav('/cart')}
                                        sx={{
                                            ...pillButtonSx,
                                            bgcolor: '#e91e63',
                                            '&:hover': {
                                                bgcolor: '#c2185b',
                                                boxShadow: '0 4px 12px rgba(233, 30, 99, 0.28)',
                                            },
                                        }}
                                    >
                                        Go to Cart
                                    </Button>
                                </Tooltip>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Grow>

            <Box sx={{ flexGrow: 1 }} />
        </Box>
    );
};

export default RightSidebar;
