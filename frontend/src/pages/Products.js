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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { fetchProducts, addProduct, updateProduct, syncProducts } from '../store/slices/productsSlice';

function Products() {
  const dispatch = useDispatch();
  const { items: products, status, loading, error } = useSelector((state) => state.products);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    barcode: '',
    salePrice: '',
    listPrice: '',
    quantity: '',
    vatRate: 18,
    images: [{ url: '' }]
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpenDialog = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        title: product.title || '',
        barcode: product.barcode || '',
        salePrice: product.salePrice || '',
        listPrice: product.listPrice || '',
        quantity: product.quantity || '',
        vatRate: product.vatRate || 18,
        images: product.images || [{ url: '' }]
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        title: '',
        barcode: '',
        salePrice: '',
        listPrice: '',
        quantity: '',
        vatRate: 18,
        images: [{ url: '' }]
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleSubmit = () => {
    if (selectedProduct) {
      dispatch(updateProduct({ id: selectedProduct._id, product: formData }));
    } else {
      dispatch(addProduct(formData));
    }
    handleCloseDialog();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSync = async () => {
    try {
      await dispatch(syncProducts()).unwrap();
      setNotification({
        open: true,
        message: 'Ürünler başarıyla senkronize edildi',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Senkronizasyon sırasında bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Ürünler
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mr: 2 }}
          >
            Yeni Ürün
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSync}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Senkronize Et'}
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Barkod</TableCell>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>Satış Fiyatı</TableCell>
              <TableCell>Liste Fiyatı</TableCell>
              <TableCell>Stok</TableCell>
              <TableCell>KDV</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.barcode}</TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.salePrice} TL</TableCell>
                <TableCell>{product.listPrice} TL</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>%{product.vatRate}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpenDialog(product)}>
                    Düzenle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Ürün Adı"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Barkod"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Satış Fiyatı"
              name="salePrice"
              type="number"
              value={formData.salePrice}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Liste Fiyatı"
              name="listPrice"
              type="number"
              value={formData.listPrice}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Stok"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="KDV Oranı"
              name="vatRate"
              type="number"
              value={formData.vatRate}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedProduct ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Products; 