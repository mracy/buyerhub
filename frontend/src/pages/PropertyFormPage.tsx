import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Alert,
} from '@mui/material';
import { propertiesAPI } from '../services/api';
import Sidebar from '../components/Sidebar';

const PropertyFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    location: '',
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    imageUrl: '',
    type: 'apartment',
    status: 'available',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role !== 'admin') {
        navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }

    if (id) {
      loadProperty(id);
    }
  }, [id, navigate]);

  const loadProperty = async (propertyId: string) => {
    try {
      const response = await propertiesAPI.getOne(propertyId);
      const { data } = response.data;
      setFormData({
        title: data.title,
        description: data.description,
        price: data.price,
        location: data.location,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        imageUrl: data.imageUrl,
        type: data.type,
        status: data.status || 'available',
      });
    } catch (err) {
      setError('Failed to load property details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const propertyPayload = {
      data: formData,
      metadata: {
        views: 0,
        tags: [],
        featured: false,
        verified: true,
      },
    };

    try {
      if (id) {
        await propertiesAPI.update(id, propertyPayload);
      } else {
        await propertiesAPI.add(propertyPayload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save property. Please check your permissions and data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar currentTab={0} onTabChange={() => navigate('/dashboard')} userRole={user?.role} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
              {id ? 'Edit Property' : 'Add New Property'}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Property Title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price ($)"
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Bedrooms"
                    type="number"
                    required
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Bathrooms"
                    type="number"
                    required
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Area (sqft)"
                    type="number"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Property Type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <MenuItem value="apartment">Apartment</MenuItem>
                    <MenuItem value="house">House</MenuItem>
                    <MenuItem value="villa">Villa</MenuItem>
                    <MenuItem value="condo">Condo</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="available">For Sale</MenuItem>
                    <MenuItem value="sold">Sold</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Image URL"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    helperText="Paste a URL for the property image"
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                  >
                    {loading ? 'Saving...' : id ? 'Update Property' : 'Create Property'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/dashboard')}
                    sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default PropertyFormPage;
