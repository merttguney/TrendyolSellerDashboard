import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { fetchOrders, updateOrderStatus } from '../store/slices/ordersSlice';

function Orders() {
  const dispatch = useDispatch();
  const { items: orders, status } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (newStatus) => {
    if (selectedOrder) {
      dispatch(updateOrderStatus({ orderId: selectedOrder.id, status: newStatus }));
      handleCloseDialog();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Yeni':
        return 'primary';
      case 'İşleniyor':
        return 'warning';
      case 'Tamamlandı':
        return 'success';
      default:
        return 'default';
    }
  };

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 800, letterSpacing: 1, color: 'primary.main' }}>
        Siparişler
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #ffb26b 0%, #ff6f3c 100%)' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Sipariş No</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Müşteri</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Tarih</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Tutar</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Durum</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, idx) => (
              <TableRow
                key={order.id}
                sx={{
                  background: idx % 2 === 0 ? '#fff' : '#f8f9fa',
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'rgba(255,111,60,0.08)',
                  },
                }}
              >
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.total} TL</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      borderRadius: 2,
                      px: 1.5,
                      boxShadow: '0 1px 4px rgba(255,111,60,0.10)',
                      fontSize: 15,
                      letterSpacing: 0.5,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label="Detay"
                    onClick={() => handleOpenDialog(order)}
                    size="small"
                    sx={{
                      bgcolor: 'primary.main',
                      color: '#fff',
                      fontWeight: 700,
                      borderRadius: 2,
                      px: 1.5,
                      boxShadow: '0 1px 4px rgba(255,111,60,0.10)',
                      fontSize: 15,
                      letterSpacing: 0.5,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { borderRadius: 4, p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>Sipariş Detayı</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedOrder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Sipariş No: {selectedOrder.orderNumber}
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Müşteri: {selectedOrder.customer}
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Tarih: {selectedOrder.date}
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Tutar: {selectedOrder.total} TL
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Durum: {selectedOrder.status}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          {selectedOrder && selectedOrder.status !== 'Tamamlandı' && (
            <>
              {selectedOrder.status === 'Yeni' && (
                <Button onClick={() => handleStatusChange('İşleniyor')} color="warning" sx={{ fontWeight: 700, borderRadius: 2 }}>
                  İşleme Al
                </Button>
              )}
              {selectedOrder.status === 'İşleniyor' && (
                <Button onClick={() => handleStatusChange('Tamamlandı')} color="success" sx={{ fontWeight: 700, borderRadius: 2 }}>
                  Tamamla
                </Button>
              )}
            </>
          )}
          <Button onClick={handleCloseDialog} sx={{ fontWeight: 600, borderRadius: 2 }}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Orders; 