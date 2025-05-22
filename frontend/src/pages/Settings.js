import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { fetchSettings, updateSettings, testConnection } from '../store/slices/settingsSlice';

function Settings() {
  const dispatch = useDispatch();
  const { data: settings, status, error } = useSelector((state) => state.settings);
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    supplierId: '',
    webhookUrl: '',
    autoSync: false,
    syncInterval: 30,
    minStockAlert: 10,
    stockUpdateInterval: 5,
    orderCheckInterval: 5,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setFormData({
        apiKey: settings.apiKey || '',
        apiSecret: settings.apiSecret || '',
        supplierId: settings.supplierId || '',
        webhookUrl: settings.webhookUrl || '',
        autoSync: settings.autoSync || false,
        syncInterval: settings.syncInterval || 30,
        minStockAlert: settings.minStockAlert || 10,
        stockUpdateInterval: settings.stockUpdateInterval || 5,
        orderCheckInterval: settings.orderCheckInterval || 5,
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = async () => {
    try {
      await dispatch(updateSettings(formData)).unwrap();
      setSnackbar({
        open: true,
        message: 'Ayarlar başarıyla kaydedildi',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error || 'Ayarlar kaydedilirken bir hata oluştu',
        severity: 'error',
      });
    }
  };

  const handleTestConnection = async () => {
    try {
      await dispatch(testConnection({
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret,
        supplierId: formData.supplierId,
      })).unwrap();
      setSnackbar({
        open: true,
        message: 'Bağlantı testi başarılı',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error || 'Bağlantı testi başarısız',
        severity: 'error',
      });
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

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 800, letterSpacing: 1, color: 'primary.main' }}>
        Ayarlar
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', background: 'linear-gradient(135deg, #fffbe6 0%, #f8f9fa 100%)' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
              Trendyol API Ayarları
            </Typography>
            <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Supplier ID"
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                sx={{ borderRadius: 2 }}
              />
              <TextField
                fullWidth
                label="API Key"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                sx={{ borderRadius: 2 }}
              />
              <TextField
                fullWidth
                label="API Secret"
                name="apiSecret"
                type="password"
                value={formData.apiSecret}
                onChange={handleChange}
                sx={{ borderRadius: 2 }}
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 700,
                    px: 2.5,
                    py: 1.2,
                    fontSize: 16,
                    boxShadow: '0 2px 8px rgba(255,111,60,0.12)',
                  }}
                >
                  Kaydet
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleTestConnection}
                  disabled={!formData.apiKey || !formData.apiSecret || !formData.supplierId}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 700,
                    px: 2.5,
                    py: 1.2,
                    fontSize: 16,
                  }}
                >
                  Bağlantıyı Test Et
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', background: 'linear-gradient(135deg, #fffbe6 0%, #f8f9fa 100%)' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
              Genel Ayarlar
            </Typography>
            <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.autoSync}
                    onChange={handleChange}
                    name="autoSync"
                    sx={{
                      '& .MuiSwitch-thumb': { bgcolor: 'primary.main' },
                      '& .MuiSwitch-track': { bgcolor: 'primary.light' },
                    }}
                  />
                }
                label="Otomatik Senkronizasyon"
              />
              <TextField
                fullWidth
                label="Minimum Stok Uyarı Limiti"
                name="minStockAlert"
                value={formData.minStockAlert}
                onChange={handleChange}
                sx={{ borderRadius: 2 }}
              />
              <TextField
                fullWidth
                label="Stok Güncelleme Aralığı (dk)"
                name="stockUpdateInterval"
                value={formData.stockUpdateInterval}
                onChange={handleChange}
                sx={{ borderRadius: 2 }}
              />
              <TextField
                fullWidth
                label="Sipariş Kontrol Aralığı (dk)"
                name="orderCheckInterval"
                value={formData.orderCheckInterval}
                onChange={handleChange}
                sx={{ borderRadius: 2 }}
              />
              <TextField
                fullWidth
                label="Webhook URL"
                name="webhookUrl"
                value={formData.webhookUrl}
                onChange={handleChange}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
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

export default Settings; 