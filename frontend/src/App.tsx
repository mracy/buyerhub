import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setTheme, getUserTheme, setLanguage, getUserLanguage } from './store';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { useTranslation } from 'react-i18next';
import './i18n';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PropertyFormPage from './pages/PropertyFormPage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Box } from '@mui/material';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const showNavbar = !['/login', '/register'].includes(location.pathname);

  // Apply user's saved theme and language ONLY on authenticated pages (not login/register)
  React.useEffect(() => {
    if (showNavbar) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const savedTheme = getUserTheme(user.id);
        const savedLanguage = getUserLanguage(user.id);
        dispatch(setTheme(savedTheme));
        dispatch(setLanguage(savedLanguage));
      }
    }
  }, [showNavbar, dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/properties/new"
          element={
            <PrivateRoute>
              <PropertyFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/properties/edit/:id"
          element={
            <PrivateRoute>
              <PropertyFormPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
      <Footer />
    </Box>
  );
};

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: 'muiltr',
});

function App() {
  const { theme: mode, language } = useSelector((state: RootState) => state.settings);
  const { i18n } = useTranslation();
  const isRtl = language === 'ar';

  React.useEffect(() => {
    document.dir = isRtl ? 'rtl' : 'ltr';
    i18n.changeLanguage(language);
  }, [language, isRtl, i18n]);

  const theme = React.useMemo(
    () =>
      createTheme({
        direction: isRtl ? 'rtl' : 'ltr',
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#0a2540' : '#7986cb', // Lighter blue for dark mode
          },
          secondary: {
            main: '#635bff',
          },
          background: {
            default: mode === 'light' ? '#f6f9fc' : '#0a2540',
            paper: mode === 'light' ? '#ffffff' : '#1a1f36',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
          },
          h5: {
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 8,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: mode === 'light' 
                  ? '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
                  : '0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -2px rgba(0,0,0,0.3)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
