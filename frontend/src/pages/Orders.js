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
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Siparişler
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sipariş No</TableCell>
              <TableCell>Müşteri</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Tutar</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.total} TL</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label="Detay"
                    onClick={() => handleOpenDialog(order)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Sipariş Detayı</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Sipariş No: {selectedOrder.orderNumber}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Müşteri: {selectedOrder.customer}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Tarih: {selectedOrder.date}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Tutar: {selectedOrder.total} TL
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Durum: {selectedOrder.status}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedOrder && selectedOrder.status !== 'Tamamlandı' && (
            <>
              {selectedOrder.status === 'Yeni' && (
                <Button onClick={() => handleStatusChange('İşleniyor')} color="warning">
                  İşleme Al
                </Button>
              )}
              {selectedOrder.status === 'İşleniyor' && (
                <Button onClick={() => handleStatusChange('Tamamlandı')} color="success">
                  Tamamla
                </Button>
              )}
            </>
          )}
          <Button onClick={handleCloseDialog}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Orders; 