import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, Paper, Card, CardContent, CardActions,
    IconButton, Chip, CircularProgress, Alert, Dialog, DialogTitle,
    DialogContent, TextField, Checkbox, FormControlLabel
} from '@mui/material';
import { Delete, Edit, CreditCard as CreditCardIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CreditCards = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [savedCards, setSavedCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCard, setEditingCard] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        cardholderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardBrand: '',
        isDefault: false
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchSavedCards();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchSavedCards = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:8080/api/saved-cards/me');
            setSavedCards(response.data);
        } catch (err) {
            console.error('Failed to fetch saved cards', err);
            setError('Failed to load saved cards');
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditingCard(null);
        setFormData({
            cardholderName: '',
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '',
            cardBrand: '',
            isDefault: false
        });
        setOpenDialog(true);
    };

    const handleEdit = (card) => {
        setEditingCard(card);
        setFormData({
            cardholderName: card.cardholderName,
            cardNumber: '',
            expiryMonth: card.expiryMonth,
            expiryYear: card.expiryYear,
            cvv: '',
            cardBrand: card.cardBrand || '',
            isDefault: card.isDefault
        });
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this card?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/saved-cards/${id}`);
            setSuccess('Card deleted successfully');
            fetchSavedCards();
        } catch (err) {
            console.error('Failed to delete card', err);
            setError('Failed to delete card');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/saved-cards/${id}/set-default`);
            setSuccess('Default card updated');
            fetchSavedCards();
        } catch (err) {
            console.error('Failed to set default', err);
            setError('Failed to set default card');
        }
    };

    const detectCardBrand = (number) => {
        const cleaned = number.replace(/\s/g, '');
        if (cleaned.startsWith('4')) return 'Visa';
        if (cleaned.startsWith('5')) return 'Mastercard';
        if (cleaned.startsWith('3')) return 'American Express';
        return 'Card';
    };

    const handleSaveCard = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Extract last 4 digits
        const cleaned = formData.cardNumber.replace(/\s/g, '');
        const last4 = cleaned.slice(-4);
        const brand = formData.cardBrand || detectCardBrand(cleaned);

        const cardData = {
            cardholderName: formData.cardholderName,
            last4: last4,
            expiryMonth: formData.expiryMonth,
            expiryYear: formData.expiryYear,
            cardBrand: brand,
            isDefault: formData.isDefault
        };

        try {
            if (editingCard) {
                // Update existing
                await axios.put(`http://localhost:8080/api/saved-cards/${editingCard.id}`, cardData);
                setSuccess('Card updated successfully');
            } else {
                // Create new
                await axios.post('http://localhost:8080/api/saved-cards', cardData);
                setSuccess('Card added successfully');
            }
            setOpenDialog(false);
            fetchSavedCards();
        } catch (err) {
            console.error('Failed to save card', err);
            setError('Failed to save card');
        }
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\s/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted;
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\s/g, '');
        if (/^\d*$/.test(value) && value.length <= 16) {
            setFormData({ ...formData, cardNumber: formatCardNumber(value) });
        }
    };

    if (!isAuthenticated) {
        return (
            <Box maxWidth={800} mx="auto" mt={5}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Please login to manage credit cards
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
                        Login
                    </Button>
                </Paper>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box maxWidth={900} mx="auto">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                    Manage Credit Cards
                </Typography>
                <Button variant="contained" onClick={handleAddNew}>
                    Add New Card
                </Button>
            </Box>

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {savedCards.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No saved credit cards
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                        Add your first credit card to make checkout faster!
                    </Typography>
                    <Button variant="contained" onClick={handleAddNew}>
                        Add Card
                    </Button>
                </Paper>
            ) : (
                <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={2}>
                    {savedCards.map((card) => (
                        <Card key={card.id} elevation={2}>
                            <CardContent>
                                {card.isDefault && (
                                    <Chip
                                        label="Default"
                                        color="primary"
                                        size="small"
                                        icon={<CreditCardIcon />}
                                        sx={{ mb: 1 }}
                                    />
                                )}
                                <Typography variant="h6" gutterBottom fontWeight="medium">
                                    {card.cardholderName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {card.cardBrand || 'Card'}
                                </Typography>
                                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                                    •••• •••• •••• {card.last4}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Expires: {card.expiryMonth}/{card.expiryYear}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" startIcon={<Edit />} onClick={() => handleEdit(card)}>
                                    Edit
                                </Button>
                                <IconButton size="small" color="error" onClick={() => handleDelete(card.id)}>
                                    <Delete />
                                </IconButton>
                                {!card.isDefault && (
                                    <Button size="small" onClick={() => handleSetDefault(card.id)}>
                                        Set as Default
                                    </Button>
                                )}
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingCard ? 'Edit Card' : 'Add New Card'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSaveCard} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Cardholder Name"
                            name="cardholderName"
                            value={formData.cardholderName}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Card Number"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            margin="normal"
                            required
                            placeholder="1234 5678 9012 3456"
                            helperText={editingCard ? "Enter new card number to update" : ""}
                        />
                        <Box display="flex" gap={2}>
                            <TextField
                                fullWidth
                                label="Expiry Month (MM)"
                                name="expiryMonth"
                                value={formData.expiryMonth}
                                onChange={handleChange}
                                margin="normal"
                                required
                                placeholder="12"
                                inputProps={{ maxLength: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Expiry Year (YY)"
                                name="expiryYear"
                                value={formData.expiryYear}
                                onChange={handleChange}
                                margin="normal"
                                required
                                placeholder="25"
                                inputProps={{ maxLength: 2 }}
                            />
                        </Box>
                        <TextField
                            fullWidth
                            label="CVV"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            margin="normal"
                            type="password"
                            placeholder="123"
                            inputProps={{ maxLength: 4 }}
                            helperText="CVV is not stored, only used for verification"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleChange}
                                />
                            }
                            label="Set as default card"
                        />

                        <Box display="flex" gap={2} mt={3}>
                            <Button type="submit" variant="contained" fullWidth>
                                Save Card
                            </Button>
                            <Button variant="outlined" onClick={() => setOpenDialog(false)} fullWidth>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default CreditCards;
