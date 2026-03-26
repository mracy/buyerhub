import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { authAPI } from '../services/api';
import { useDispatch } from 'react-redux';
import { setTheme, setLanguage } from '../store';
import { useTranslation } from 'react-i18next';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Always force light theme and English on register page
  useEffect(() => {
    dispatch(setTheme('light'));
    dispatch(setLanguage('en'));
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // New users always start with light theme and English (default)
      dispatch(setTheme('light'));
      dispatch(setLanguage('en'));
      
      setSuccess(t('register_success', 'Registration successful! Redirecting...'));
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err: any) {
      setError(err.response?.data?.message || t('register_failed', 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: { xs: 4, sm: 6, md: 8 }, 
        px: { xs: 2, sm: 3 },
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, width: '100%' }}>
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' } }}
          >
            {t('your_property_portal', 'Real Estate Portal')}
          </Typography>
          <Typography 
            component="h2" 
            variant="h6" 
            align="center" 
            color="textSecondary" 
            gutterBottom
            sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}
          >
            {t('sign_up', 'Sign Up')}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label={t('full_name', 'Full Name')}
              autoFocus
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              size="medium"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label={t('email_address', 'Email Address')}
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              size="medium"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label={t('password', 'Password')}
              type="password"
              autoComplete="new-password"
              helperText="Min 8 characters, 1 uppercase, 1 lowercase, 1 number"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              size="medium"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
              disabled={loading}
            >
              {loading ? `${t('sign_up', 'Sign Up')}...` : t('sign_up', 'Sign Up')}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography 
                  color="primary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  {t('already_have_account', 'Already have an account? Sign In')}
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
