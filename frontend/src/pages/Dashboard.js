import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  Storage as StockIcon,
  Warning as AlertIcon,
} from '@mui/icons-material';
import { fetchProducts } from '../store/slices/productsSlice';
import { fetchOrders } from '../store/slices/ordersSlice';
import { fetchStock } from '../store/slices/stockSlice';

const StatCard = ({ title, value, icon, color, loading }) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      height: 160,
      borderRadius: 4,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      background: 'linear-gradient(135deg, #fffbe6 0%, #f8f9fa 100%)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
      '&:hover': {
        boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
        transform: 'translateY(-2px) scale(1.02)',
      },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography component="h2" variant="subtitle1" color="secondary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
        {title}
      </Typography>
      <Box
        sx={{
          bgcolor: color || 'primary.main',
          color: '#fff',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          fontSize: 28,
          transition: 'background 0.2s',
        }}
      >
        {icon}
      </Box>
    </Box>
    {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <CircularProgress size={28} />
      </Box>
    ) : (
      <Typography component="p" variant="h3" sx={{ fontWeight: 800, color: 'primary.dark', mt: 2 }}>
        {value}
      </Typography>
    )}
  </Paper>
);

function Dashboard() {
  const dispatch = useDispatch();
  const { items: products, status: productsStatus } = useSelector((state) => state.products);
  const { items: orders, status: ordersStatus } = useSelector((state) => state.orders);
  const { items: stockItems, status: stockStatus } = useSelector((state) => state.stock);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    dispatch(fetchStock());
  }, [dispatch]);

  const stats = {
    totalProducts: products.length,
    activeOrders: orders.filter(order => order.status === 'Yeni' || order.status === 'İşleniyor').length,
    lowStock: stockItems.filter(item => item.currentStock <= item.minStock).length,
    pendingSync: 0, // Bu değer backend'den gelecek
  };

  const isLoading = productsStatus === 'loading' || ordersStatus === 'loading' || stockStatus === 'loading';

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Toplam Ürün"
            value={stats.totalProducts}
            icon={<ProductsIcon sx={{ fontSize: 28 }} />}
            color="primary.main"
            loading={productsStatus === 'loading'}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Aktif Sipariş"
            value={stats.activeOrders}
            icon={<OrdersIcon sx={{ fontSize: 28 }} />}
            color="info.main"
            loading={ordersStatus === 'loading'}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Düşük Stok"
            value={stats.lowStock}
            icon={<StockIcon sx={{ fontSize: 28 }} />}
            color="warning.main"
            loading={stockStatus === 'loading'}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Senkronizasyon Bekleyen"
            value={stats.pendingSync}
            icon={<AlertIcon sx={{ fontSize: 28 }} />}
            color="error.main"
            loading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 