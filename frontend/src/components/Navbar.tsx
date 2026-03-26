import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Avatar, Snackbar, Alert, SvgIcon, SvgIconProps } from '@mui/material';
import { Brightness4, Brightness7, Logout, Dashboard } from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, setTheme, setLanguage, saveUserTheme, saveUserLanguage } from '../store';
import { usersAPI } from '../services/api';

const CustomLanguageIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2m6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56M12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96M4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56m2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8M12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96M14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2m.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56M16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2z" />
  </SvgIcon>
);

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { theme, language } = useSelector((state: RootState) => state.settings);
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleCloseLangMenu = () => {
    setLangAnchorEl(null);
  };

  const handleThemeToggle = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    
    // Persist to per-user localStorage AND database
    if (user) {
      saveUserTheme(user.id, newTheme);

      // Update local user state
      const updatedUser = { ...user, settings: { ...user.settings, theme: newTheme } };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      try {
        await usersAPI.updateSettings({ theme: newTheme });
      } catch (err) {
        console.error('Failed to persist theme preference to server', err);
      }
    }
  };

  const handleLanguageChange = async (lng: string) => {
    dispatch(setLanguage(lng));
    i18n.changeLanguage(lng);
    handleCloseLangMenu();

    // Persist to per-user localStorage AND database
    if (user) {
      saveUserLanguage(user.id, lng);

      // Update local user state
      const updatedUser = { ...user, settings: { ...user.settings, language: lng } };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      try {
        await usersAPI.updateSettings({ language: lng });
      } catch (err) {
        console.error('Failed to persist language preference to server', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Reset Redux to light for login page display
    dispatch(setTheme('light'));
    setSnackbar({ open: true, message: 'Logged out successfully', severity: 'success' });
    setTimeout(() => navigate('/login'), 300);
    handleCloseUserMenu();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
            }} 
            onClick={() => navigate('/dashboard')}
          >
            {t('your_property_portal', 'BuyerHub')}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <IconButton 
              color="inherit" 
              onClick={handleThemeToggle} 
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              size="small"
              sx={{ p: { xs: 0.75, sm: 1 } }}
            >
              {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            <IconButton 
              color="inherit" 
              onClick={handleOpenLangMenu} 
              title="Change language"
              size="small"
              sx={{ p: { xs: 0.75, sm: 1 } }}
            >
              <CustomLanguageIcon />
            </IconButton>
            <Menu
              anchorEl={langAnchorEl}
              open={Boolean(langAnchorEl)}
              onClose={handleCloseLangMenu}
            >
              <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
              <MenuItem onClick={() => handleLanguageChange('es')}>Español</MenuItem>
              <MenuItem onClick={() => handleLanguageChange('fr')}>Français</MenuItem>
              <MenuItem onClick={() => handleLanguageChange('de')}>Deutsch</MenuItem>
              <MenuItem onClick={() => handleLanguageChange('zh')}>中文</MenuItem>
              <MenuItem onClick={() => handleLanguageChange('ja')}>日本語</MenuItem>
              <MenuItem onClick={() => handleLanguageChange('ar')}>العربية</MenuItem>
            </Menu>

            {user && (
              <>
                <Typography 
                  sx={{ 
                    display: { xs: 'none', sm: 'block' }, 
                    mr: 1,
                    fontSize: { sm: '0.875rem', md: '1rem' }
                  }}
                >
                  {user.name}
                </Typography>
                <IconButton 
                  onClick={handleOpenUserMenu} 
                  sx={{ p: { xs: 0.25, sm: 0.5 } }}
                >
                  <Avatar 
                    alt={user.name} 
                    sx={{ 
                      width: { xs: 28, sm: 32 }, 
                      height: { xs: 28, sm: 32 },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    {user.name?.charAt(0)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => { navigate('/dashboard'); handleCloseUserMenu(); }}>
                    <Dashboard sx={{ mr: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }} /> 
                    <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{t('dashboard', 'Dashboard')}</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }} /> 
                    <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{t('logout', 'Logout')}</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
