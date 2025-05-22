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
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { fetchStock, updateStock, bulkUpdateStock } from '../store/slices/stockSlice';

function Stock() {
  const dispatch = useDispatch();
  const { items: stockItems, status } = useSelector((state) => state.stock);
  const [stockUpdates, setStockUpdates] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    dispatch(fetchStock());
  }, [dispatch]);

  const handleStockChange = (productId, value) => {
    setStockUpdates({
      ...stockUpdates,
      [productId]: parseInt(value, 10),
    });
  };

  const handleUpdateStock = (productId) => {
    const newQuantity = stockUpdates[productId];
    if (newQuantity !== undefined) {
      dispatch(updateStock({ productId, quantity: newQuantity }));
      setSnackbar({
        open: true,
        message: 'Stok başarıyla güncellendi',
        severity: 'success',
      });
    }
  };

  const handleBulkUpdate = () => {
    const updates = Object.entries(stockUpdates).map(([productId, quantity]) => ({
      productId: parseInt(productId, 10),
      quantity,
    }));

    if (updates.length > 0) {
      dispatch(bulkUpdateStock(updates));
      setSnackbar({
        open: true,
        message: 'Toplu stok güncellemesi başarılı',
        severity: 'success',
      });
      setStockUpdates({});
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 800, letterSpacing: 1, color: 'primary.main' }}>
          Stok Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleBulkUpdate}
          disabled={Object.keys(stockUpdates).length === 0}
          sx={{
            boxShadow: '0 2px 8px rgba(255,111,60,0.12)',
            borderRadius: 3,
            fontWeight: 700,
            px: 2.5,
            py: 1.2,
            fontSize: 16,
          }}
        >
          Toplu Güncelle
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #ffb26b 0%, #ff6f3c 100%)' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Ürün Adı</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>SKU</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Mevcut Stok</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Minimum Stok</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Yeni Stok</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockItems.map((item, idx) => (
              <TableRow
                key={item.id}
                sx={{
                  background: idx % 2 === 0 ? '#fff' : '#f8f9fa',
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'rgba(255,111,60,0.08)',
                  },
                }}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell
                  sx={{
                    color: item.currentStock <= item.minStock ? 'error.main' : 'inherit',
                    fontWeight: item.currentStock <= item.minStock ? 700 : 500,
                  }}
                >
                  {item.currentStock}
                </TableCell>
                <TableCell>{item.minStock}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={stockUpdates[item.id] ?? item.currentStock}
                    onChange={(e) => handleStockChange(item.id, e.target.value)}
                    inputProps={{ min: 0 }}
                    sx={{ borderRadius: 2, background: '#fff' }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={() => handleUpdateStock(item.id)}
                    disabled={stockUpdates[item.id] === undefined}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      px: 2,
                      py: 0.7,
                      boxShadow: '0 1px 4px rgba(255,111,60,0.10)',
                      color: '#fff',
                      background: 'primary.main',
                      '&:hover': {
                        background: 'primary.dark',
                      },
                    }}
                  >
                    Güncelle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Stock; 