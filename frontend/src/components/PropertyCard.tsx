import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface PropertyCardProps {
  property: {
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
      features?: string[];
      amenities?: string[];
    };
    metadata?: {
      views?: number;
      featured?: boolean;
      verified?: boolean;
      tags?: string[];
    };
  };
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavourite,
  onToggleFavourite,
  isAdmin,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { data, metadata } = property;
  const navigate = useNavigate();

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      }
    }}>
      <IconButton
        sx={{
          position: 'absolute',
          top: { xs: 4, sm: 8 },
          right: { xs: 4, sm: 8 },
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 1,
          '&:hover': { bgcolor: 'background.paper', opacity: 0.95 },
          zIndex: 1,
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 }
        }}
        onClick={() => onToggleFavourite(property.id)}
      >
        {isFavourite ? (
          <FavoriteIcon color="error" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
        ) : (
          <FavoriteBorderIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, color: 'text.secondary' }} />
        )}
      </IconButton>

      <CardMedia
        component="img"
        height="200"
        image={data.imageUrl}
        alt={data.title}
        sx={{ 
          height: { xs: 160, sm: 180, md: 200 },
          objectFit: 'cover'
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography 
            variant="h6" 
            component="div" 
            noWrap
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              flex: 1,
              mr: 1
            }}
          >
            {data.title}
          </Typography>
          <Chip 
            label={data.type} 
            size="small" 
            color="primary"
            sx={{ fontSize: { xs: '0.7rem', sm: '0.8125rem' } }}
          />
          {isAdmin && (
            <Box sx={{ display: 'flex', ml: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => navigate(`/admin/properties/edit/${property.id}`)}
                sx={{ color: 'primary.main' }}
                title="Edit property"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => onDelete?.(property.id)}
                sx={{ color: 'error.main' }}
                title="Delete property"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        <Typography 
          variant="h5" 
          color="primary" 
          gutterBottom
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
        >
          ${data.price.toLocaleString()}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon 
            fontSize="small" 
            color="action" 
            sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} 
          />
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            {data.location}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={data.status === 'available' ? t('for_sale', 'For Sale') : t('sold', 'Sold')} 
            color={data.status === 'available' ? 'success' : 'error'}
            size="small"
            variant="filled"
            sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
          />
          {metadata?.tags?.map((tag: string) => (
            <Chip 
              key={tag} 
              label={tag} 
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          ))}
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            fontSize: { xs: '0.875rem', sm: '0.925rem' },
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {data.description}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 2 },
          flexWrap: 'wrap'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BedIcon 
              fontSize="small" 
              sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} 
            />
            <Typography 
              variant="body2"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {data.bedrooms} {t('beds', 'Beds')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BathtubIcon 
              fontSize="small" 
              sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} 
            />
            <Typography 
              variant="body2"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {data.bathrooms} {t('baths', 'Baths')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SquareFootIcon 
              fontSize="small" 
              sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} 
            />
            <Typography 
              variant="body2"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {data.area} {t('sqft', 'sqft')}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
