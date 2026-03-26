import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { propertiesAPI, favouritesAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import Chatbot from '../components/Chatbot';
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar';

const CHATBOT_ENABLED = process.env.REACT_APP_CHATBOT_ENABLED !== 'false';

interface Property {
  id: string;
  data: {
    title: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    imageUrl: string;
    type: string;
    status: string;
  };
  metadata?: {
    views?: number;
    featured?: boolean;
  };
}

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
  const [tabValue, setTabValue] = useState(0);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; propertyId: string | null }>({ open: false, propertyId: null });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      if (!sessionStorage.getItem('welcomed')) {
        setWelcomeOpen(true);
        sessionStorage.setItem('welcomed', 'true');
      }
    }
  }, []);

  useEffect(() => {
    loadProperties();
    if (tabValue === 2) {
      loadFavourites(true);
    } else {
      loadFavourites();
    }
  }, [tabValue]);

  const loadProperties = async () => {
    try {
      const response = await propertiesAPI.getAll();
      setProperties(response.data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    }
  };

  const loadFavourites = async (global?: boolean) => {
    try {
      const response = await favouritesAPI.getAll(global);
      setFavourites(response.data);
      const ids = new Set<string>(response.data.map((fav: any) => fav.property.id));
      setFavouriteIds(ids);
    } catch (error) {
      console.error('Failed to load favourites:', error);
    }
  };

  const handleToggleFavourite = async (propertyId: string) => {
    const wasLiked = favouriteIds.has(propertyId);
    try {
      if (wasLiked) {
        await favouritesAPI.remove(propertyId);
        setToast({ open: true, message: t('removed_from_favourites', 'Removed from favourites'), severity: 'success' });
      } else {
        await favouritesAPI.add(propertyId);
        setToast({ open: true, message: t('added_to_favourites', 'Added to favourites! ❤️'), severity: 'success' });
      }
      await loadFavourites();
    } catch (error: any) {
      setToast({ open: true, message: t('failed_to_update_favourite', 'Failed to update favourite. Please try again.'), severity: 'error' });
    }
  };

  const handleDeleteProperty = async () => {
    if (!deleteDialog.propertyId) return;
    try {
      await propertiesAPI.remove(deleteDialog.propertyId);
      setToast({ open: true, message: t('property_deleted_success', 'Property deleted successfully'), severity: 'success' });
      setDeleteDialog({ open: false, propertyId: null });
      await loadProperties();
    } catch (error: any) {
      setToast({ open: true, message: t('property_deleted_error', 'Failed to delete property. Please try again.'), severity: 'error' });
      setDeleteDialog({ open: false, propertyId: null });
    }
  };


  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <Sidebar
        currentTab={tabValue}
        onTabChange={setTabValue}
        userRole={user?.role}
      />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{
            mb: { xs: 3, sm: 4 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                  color: 'primary.main'
                }}
              >
                {t('welcome', 'Welcome, ')}{user?.name}
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem' } }}
              >
                Managing your portal as <strong>{user?.role}</strong>
              </Typography>
            </Box>

            {user?.role === 'admin' && (
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/properties/new')}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontWeight: 'bold',
                  boxShadow: 2
                }}
              >
                {t('add_new_property', 'Add New Property')}
              </Button>
            )}
          </Box>

          {tabValue === 0 && (
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
              {properties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property.id}>
                  <PropertyCard
                    property={property}
                    isFavourite={favouriteIds.has(property.id)}
                    onToggleFavourite={handleToggleFavourite}
                    isAdmin={user?.role === 'admin'}
                    onDelete={(id) => setDeleteDialog({ open: true, propertyId: id })}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {(tabValue === 1 || tabValue === 2) && (
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
              {favourites.length === 0 ? (
                <Grid item xs={12}>
                  <Typography
                    align="center"
                    color="textSecondary"
                    sx={{
                      py: { xs: 3, sm: 4 },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    {tabValue === 1
                      ? t('no_favourites_yet', 'No favourites yet. Start adding properties you like!')
                      : t('no_user_favourites_found', 'No user favourites found in the system.')}
                  </Typography>
                </Grid>
              ) : (
                (() => {
                  // Group favourites by property so we don't show duplicate cards in "All User Favourites"
                  const displayMap = new Map<string, { property: any; id: string; users: any[] }>();
                  favourites.forEach((fav) => {
                    const propId = fav.property?.id;
                    if (!propId) return;
                    if (!displayMap.has(propId)) {
                      displayMap.set(propId, { property: fav.property, id: fav.id, users: [] });
                    }
                    displayMap.get(propId)!.users.push(fav.user);
                  });
                  const displayFavourites = Array.from(displayMap.values());

                  return displayFavourites.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <PropertyCard
                          property={item.property}
                          isFavourite={tabValue === 1 ? true : favouriteIds.has(item.property.id)}
                          onToggleFavourite={handleToggleFavourite}
                          isAdmin={user?.role === 'admin'}
                          onDelete={(id) => setDeleteDialog({ open: true, propertyId: id })}
                        />
                      </Box>
                      {tabValue === 2 && (
                        <Box sx={{ mt: 1.5, mb: 0.5, display: 'flex', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {t('liked_by', 'Liked by')} {item.users.length} {item.users.length === 1 ? t('user', 'user') : t('users', 'users')}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  ));
                })()
              )}
            </Grid>
          )}
        </Container>
      </Box>

      {CHATBOT_ENABLED && <Chatbot />}

      <Snackbar
        open={welcomeOpen}
        autoHideDuration={4000}
        onClose={() => setWelcomeOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setWelcomeOpen(false)} severity="success" sx={{ width: '100%' }}>
          {t('welcome_back_toast', 'Welcome back, ')}{user?.name}!
        </Alert>
      </Snackbar>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, propertyId: null })}
      >
        <DialogTitle>{t('delete_property_title', 'Delete Property')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('delete_property_desc', 'Are you sure you want to delete this property? This action cannot be undone.')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, propertyId: null })}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button onClick={handleDeleteProperty} color="error" variant="contained">
            {t('delete', 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
