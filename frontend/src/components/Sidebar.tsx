import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Toolbar,
  Divider,
  Box,
} from '@mui/material';
import {
  Home,
  Favorite,
  People,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const DRAWER_WIDTH = 240;

interface SidebarProps {
  currentTab: number;
  onTabChange: (tab: number) => void;
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, userRole }) => {
  const { t } = useTranslation();
  const isAdmin = userRole === 'admin';

  const menuItems = [
    { text: t('all_properties', 'All Properties'), icon: <Home />, id: 0 },
    { text: t('my_favourites', 'My Favourites'), icon: <Favorite />, id: 1 },
  ];

  if (isAdmin) {
    menuItems.push({ text: t('all_user_favourites', 'All User Favourites'), icon: <People />, id: 2 });
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: DRAWER_WIDTH, 
          boxSizing: 'border-box',
          position: 'relative',
          height: '100%',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        },
        display: { xs: 'none', md: 'block' }
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={currentTab === item.id}
                onClick={() => onTabChange(item.id)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    borderRadius: 2,
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: currentTab === item.id ? 'primary.main' : 'text.secondary' 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontWeight: currentTab === item.id ? 600 : 500,
                    fontSize: '0.9rem',
                    color: currentTab === item.id ? 'primary.main' : 'text.secondary'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
export { DRAWER_WIDTH };
