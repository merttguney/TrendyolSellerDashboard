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
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {title}
      </Typography>
      {icon}
    </Box>
    {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <CircularProgress size={24} />
      </Box>
    ) : (
      <Typography component="p" variant="h4">
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
            icon={<ProductsIcon sx={{ color: 'primary.main' }} />}
            loading={productsStatus === 'loading'}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Aktif Sipariş"
            value={stats.activeOrders}
            icon={<OrdersIcon sx={{ color: 'primary.main' }} />}
            loading={ordersStatus === 'loading'}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Düşük Stok"
            value={stats.lowStock}
            icon={<StockIcon sx={{ color: 'warning.main' }} />}
            loading={stockStatus === 'loading'}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Senkronizasyon Bekleyen"
            value={stats.pendingSync}
            icon={<AlertIcon sx={{ color: 'error.main' }} />}
            loading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 