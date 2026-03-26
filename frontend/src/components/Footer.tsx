import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        borderTop: '1px solid rgba(0, 0, 0, 0.12)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Real Estate Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find your dream home with our premium real estate listing service. 
              We provide the most accurate and up-to-date property information.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'center' } }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/dashboard" color="inherit" variant="body2" sx={{ textDecoration: 'none' }}>
                Dashboard
              </Link>
              <Link href="/settings" color="inherit" variant="body2" sx={{ textDecoration: 'none' }}>
                Settings
              </Link>
              <Link href="#" color="inherit" variant="body2" sx={{ textDecoration: 'none' }}>
                About Us
              </Link>
              <Link href="#" color="inherit" variant="body2" sx={{ textDecoration: 'none' }}>
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1 }}>
              <IconButton color="primary" aria-label="facebook">
                <Facebook />
              </IconButton>
              <IconButton color="primary" aria-label="twitter">
                <Twitter />
              </IconButton>
              <IconButton color="primary" aria-label="instagram">
                <Instagram />
              </IconButton>
              <IconButton color="primary" aria-label="linkedin">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
              Real Estate Portal
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
