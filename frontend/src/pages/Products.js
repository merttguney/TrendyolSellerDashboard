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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 800, letterSpacing: 1, color: 'primary.main' }}>
          Ürünler
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              mr: 2,
              boxShadow: '0 2px 8px rgba(255,111,60,0.12)',
              borderRadius: 3,
              fontWeight: 700,
              px: 2.5,
              py: 1.2,
              fontSize: 16,
            }}
          >
            Yeni Ürün
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSync}
            disabled={loading}
            sx={{
              boxShadow: '0 2px 8px rgba(255,111,60,0.12)',
              borderRadius: 3,
              fontWeight: 700,
              px: 2.5,
              py: 1.2,
              fontSize: 16,
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Senkronize Et'}
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #ffb26b 0%, #ff6f3c 100%)' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Barkod</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Ürün Adı</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Satış Fiyatı</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Liste Fiyatı</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Stok</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>KDV</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, idx) => (
              <TableRow
                key={product._id}
                sx={{
                  background: idx % 2 === 0 ? '#fff' : '#f8f9fa',
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'rgba(255,111,60,0.08)',
                  },
                }}
              >
                <TableCell>{product.barcode}</TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.salePrice} TL</TableCell>
                <TableCell>{product.listPrice} TL</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>%{product.vatRate}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleOpenDialog(product)}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      px: 2,
                      py: 0.7,
                      boxShadow: '0 1px 4px rgba(255,111,60,0.10)',
                      color: 'primary.main',
                      background: 'rgba(255,111,60,0.08)',
                      '&:hover': {
                        background: 'rgba(255,111,60,0.18)',
                      },
                    }}
                  >
                    Düzenle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { borderRadius: 4, p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>
          {selectedProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Ürün Adı"
              name="title"
              value={formData.title}
              onChange={handleChange}
              sx={{ borderRadius: 2 }}
            />
            <TextField
              fullWidth
              label="Barkod"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              sx={{ borderRadius: 2 }}
            />
            <TextField
              fullWidth
              label="Satış Fiyatı"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              sx={{ borderRadius: 2 }}
            />
            <TextField
              fullWidth
              label="Liste Fiyatı"
              name="listPrice"
              value={formData.listPrice}
              onChange={handleChange}
              sx={{ borderRadius: 2 }}
            />
            <TextField
              fullWidth
              label="Stok"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              sx={{ borderRadius: 2 }}
            />
            <TextField
              fullWidth
              label="KDV Oranı"
              name="vatRate"
              value={formData.vatRate}
              onChange={handleChange}
              sx={{ borderRadius: 2 }}
            />
            <TextField
              fullWidth
              label="Görsel URL"
              name="images"
              value={formData.images[0]?.url || ''}
              onChange={e => setFormData({ ...formData, images: [{ url: e.target.value }] })}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button onClick={handleCloseDialog} color="secondary" sx={{ fontWeight: 600, borderRadius: 2 }}>
            İptal
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ fontWeight: 700, borderRadius: 2 }}>
            Kaydet
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