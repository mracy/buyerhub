import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  MenuItem,
  Alert,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, setTheme, setLanguage } from '../store';
import Navbar from '../components/Navbar';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { theme: storeTheme, language: storeLanguage } = useSelector((state: RootState) => state.settings);
  const [user, setUser] = useState<any>(null);
  const [theme, setLocalTheme] = useState<'light' | 'dark'>(storeTheme);
  const [language, setLocalLanguage] = useState(storeLanguage);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setTheme(theme));
    dispatch(setLanguage(language));
    i18n.changeLanguage(language);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}
          >
            Settings
          </Typography>
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Settings updated successfully!
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: { xs: 2, sm: 3 } }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Theme"
                  value={theme}
                  onChange={(e) => setLocalTheme(e.target.value as 'light' | 'dark')}
                  size="medium"
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Language"
                  value={language}
                  onChange={(e) => setLocalLanguage(e.target.value)}
                  size="medium"
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
                >
                  User Information
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, mb: 0.5 }}
                >
                  <strong>Name:</strong> {user?.name}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, mb: 0.5 }}
                >
                  <strong>Email:</strong> {user?.email}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  <strong>Role:</strong> {user?.role}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Save Settings
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default SettingsPage;
