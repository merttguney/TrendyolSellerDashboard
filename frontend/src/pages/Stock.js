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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Stok Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleBulkUpdate}
          disabled={Object.keys(stockUpdates).length === 0}
        >
          Toplu Güncelle
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Mevcut Stok</TableCell>
              <TableCell>Minimum Stok</TableCell>
              <TableCell>Yeni Stok</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell
                  sx={{
                    color: item.currentStock <= item.minStock ? 'error.main' : 'inherit',
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
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={() => handleUpdateStock(item.id)}
                    disabled={stockUpdates[item.id] === undefined}
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