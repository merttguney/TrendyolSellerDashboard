import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  Storage as StockIcon,
  Settings as SettingsIcon,
  AccountCircle,
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Ürünler', icon: <ProductsIcon />, path: '/products' },
  { text: 'Siparişler', icon: <OrdersIcon />, path: '/orders' },
  { text: 'Stok', icon: <StockIcon />, path: '/stock' },
  { text: 'Ayarlar', icon: <SettingsIcon />, path: '/settings' },
];

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <div style={{
      height: '100%',
      background: 'linear-gradient(135deg, #ff6f3c 0%, #ffb26b 100%)',
      color: '#fff',
      boxShadow: '2px 0 12px rgba(0,0,0,0.07)'
    }}>
      <Toolbar sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 72 }}>
        <Avatar sx={{ bgcolor: '#fff', color: '#ff6f3c', mr: 1, width: 36, height: 36, fontWeight: 700 }}>T</Avatar>
        <Typography
          variant="h6"
          noWrap={false}
          component="div"
          sx={{
            fontWeight: 700,
            letterSpacing: 1,
            fontSize: 18,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.2,
            maxWidth: 120, 
          }}
        >
          Trendyol Satıcı Paneli
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 1 }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.18)' : 'transparent',
              color: '#fff',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.12)',
                color: '#fff',
              },
              fontWeight: location.pathname === item.path ? 700 : 500,
              boxShadow: location.pathname === item.path ? '0 2px 8px rgba(0,0,0,0.10)' : 'none',
            }}
          >
            <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'linear-gradient(90deg, #ff6f3c 0%, #ffb26b 100%)',
          color: '#fff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          <IconButton color="inherit" onClick={handleAvatarClick}>
            <AccountCircle sx={{ fontSize: 32 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleMenuClose}>Profil</MenuItem>
            <MenuItem onClick={handleMenuClose}>Çıkış Yap</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #fffbe6 100%)',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Layout; 