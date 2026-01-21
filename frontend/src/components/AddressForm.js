import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';

const AddressForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        addressLine: '',
        city: '',
        postalCode: '',
        isDefault: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || '',
                phoneNumber: initialData.phoneNumber || '',
                addressLine: initialData.addressLine || '',
                city: initialData.city || '',
                postalCode: initialData.postalCode || '',
                isDefault: initialData.isDefault || false
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Address Line"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                margin="normal"
                required
                multiline
                rows={2}
            />
            <Box display="flex" gap={2}>
                <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
            </Box>
            <FormControlLabel
                control={
                    <Checkbox
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                    />
                }
                label="Set as default address"
            />

            <Box display="flex" gap={2} mt={3}>
                <Button type="submit" variant="contained" fullWidth>
                    Save Address
                </Button>
                <Button variant="outlined" onClick={onCancel} fullWidth>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default AddressForm;
