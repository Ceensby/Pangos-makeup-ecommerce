import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, Paper, Card, CardContent, CardActions,
    IconButton, Chip, CircularProgress, Alert, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import { Delete, Edit, Home } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AddressForm from '../components/AddressForm';

const Addresses = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAddresses();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchAddresses = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:8080/api/addresses/me');
            setAddresses(response.data);
        } catch (err) {
            console.error('Failed to fetch addresses', err);
            setError('Failed to load addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setOpenDialog(true);
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/addresses/${id}`);
            setSuccess('Address deleted successfully');
            fetchAddresses();
        } catch (err) {
            console.error('Failed to delete address', err);
            setError('Failed to delete address');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/addresses/${id}/set-default`);
            setSuccess('Default address updated');
            fetchAddresses();
        } catch (err) {
            console.error('Failed to set default', err);
            setError('Failed to set default address');
        }
    };

    const handleSaveAddress = async (addressData) => {
        setError('');
        setSuccess('');

        try {
            if (editingAddress) {
                // Update existing
                await axios.put(`http://localhost:8080/api/addresses/${editingAddress.id}`, addressData);
                setSuccess('Address updated successfully');
            } else {
                // Create new
                await axios.post('http://localhost:8080/api/addresses', addressData);
                setSuccess('Address added successfully');
            }
            setOpenDialog(false);
            fetchAddresses();
        } catch (err) {
            console.error('Failed to save address', err);
            setError('Failed to save address');
        }
    };

    if (!isAuthenticated) {
        return (
            <Box maxWidth={800} mx="auto" mt={5}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Please login to manage addresses
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
                    Manage Addresses
                </Typography>
                <Button variant="contained" onClick={handleAddNew}>
                    Add New Address
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

            {addresses.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No saved addresses
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                        Add your first delivery address to make checkout faster!
                    </Typography>
                    <Button variant="contained" onClick={handleAddNew}>
                        Add Address
                    </Button>
                </Paper>
            ) : (
                <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={2}>
                    {addresses.map((address) => (
                        <Card key={address.id} elevation={2}>
                            <CardContent>
                                {address.isDefault && (
                                    <Chip
                                        label="Default"
                                        color="primary"
                                        size="small"
                                        icon={<Home />}
                                        sx={{ mb: 1 }}
                                    />
                                )}
                                <Typography variant="h6" gutterBottom fontWeight="medium">
                                    {address.fullName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {address.phoneNumber}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {address.addressLine}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {address.city}, {address.postalCode}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" startIcon={<Edit />} onClick={() => handleEdit(address)}>
                                    Edit
                                </Button>
                                <IconButton size="small" color="error" onClick={() => handleDelete(address.id)}>
                                    <Delete />
                                </IconButton>
                                {!address.isDefault && (
                                    <Button size="small" onClick={() => handleSetDefault(address.id)}>
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
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                </DialogTitle>
                <DialogContent>
                    <AddressForm
                        initialData={editingAddress}
                        onSave={handleSaveAddress}
                        onCancel={() => setOpenDialog(false)}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Addresses;
