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
import { setTheme, setLanguage, getUserTheme, saveUserTheme, saveUserLanguage } from '../store';
import { useTranslation } from 'react-i18next';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Always force light theme and English on login page
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
      const response = await authAPI.login(formData);
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Save user's theme to per-user localStorage (DO NOT dispatch here — 
      // theme is applied by AppContent when the dashboard route loads)
      const userId = user.id;
      if (!localStorage.getItem(`theme_${userId}`)) {
        const dbTheme = (user.settings?.theme as 'light' | 'dark') || 'light';
        saveUserTheme(userId, dbTheme);
      }
      if (!localStorage.getItem(`language_${userId}`)) {
        const dbLanguage = user.settings?.language || 'en';
        saveUserLanguage(userId, dbLanguage);
      }

      setSuccess(t('login_success', 'Login successful! Redirecting...'));
      setTimeout(() => navigate('/dashboard'), 300);
    } catch (err: any) {
      setError(err.response?.data?.message || t('login_failed', 'Login failed. Please check your credentials.'));
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
            {t('sign_in', 'Sign In')}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label={t('email_address', 'Email Address')}
              type="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
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
              {loading ? `${t('sign_in', 'Sign In')}...` : t('sign_in', 'Sign In')}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography 
                  color="primary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  {t('dont_have_account', "Don't have an account? Sign Up")}
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
