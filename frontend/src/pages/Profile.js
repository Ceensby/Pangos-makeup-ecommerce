import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [profile, setProfile] = useState({
        username: '',
        email: '',
        fullName: '',
        phoneNumber: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users/me');
            setProfile({
                username: response.data.username || '',
                email: response.data.email || '',
                fullName: response.data.fullName || '',
                phoneNumber: response.data.phoneNumber || ''
            });
        } catch (err) {
            console.error('Failed to fetch profile', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
        setSuccess('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            await axios.put('http://localhost:8080/api/users/me', {
                fullName: profile.fullName,
                phoneNumber: profile.phoneNumber
            });
            setSuccess('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to update profile', err);
            setError('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <Box maxWidth={600} mx="auto" mt={5}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Please login to view your profile
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
        <Box maxWidth={600} mx="auto">
            <Typography variant="h4" mb={3} fontWeight="bold" color="primary.main">
                My Profile
            </Typography>

            <Paper elevation={3} sx={{ p: 4 }}>
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

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        value={profile.username}
                        margin="normal"
                        disabled
                        helperText="Username cannot be changed"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        value={profile.email}
                        margin="normal"
                        disabled
                        helperText="Email cannot be changed"
                    />
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        margin="normal"
                        placeholder="Enter your full name"
                    />
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        value={profile.phoneNumber}
                        onChange={handleChange}
                        margin="normal"
                        placeholder="Enter your phone number"
                    />

                    <Box display="flex" gap={2} mt={3}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                            fullWidth
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                            fullWidth
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default Profile;
