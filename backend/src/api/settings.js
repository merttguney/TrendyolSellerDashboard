const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const TrendyolAPI = require('../utils/trendyolApi');

// Ayarları getir
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({
                apiKey: '',
                apiSecret: '',
                supplierId: '',
                webhookUrl: '',
                autoSync: false,
                syncInterval: 30,
                minStockAlert: 10,
                stockUpdateInterval: 5,
                orderCheckInterval: 5
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Ayarlar alınırken hata oluştu.' });
    }
});

// Ayarları güncelle
router.put('/', async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate(
            {},
            req.body,
            { new: true, upsert: true }
        );
        res.json(settings);
    } catch (error) {
        res.status(400).json({ error: 'Ayarlar güncellenirken hata oluştu.' });
    }
});

// API bağlantısını test et
router.post('/test-connection', async (req, res) => {
    try {
        const { apiKey, apiSecret, supplierId } = req.body;
        
        if (!apiKey || !apiSecret || !supplierId) {
            return res.status(400).json({ error: 'API bilgileri eksik.' });
        }

        const trendyolApi = new TrendyolAPI(supplierId, apiKey, apiSecret);
        const testResult = await trendyolApi.testConnection();

        if (testResult.success) {
            res.json({ message: 'Bağlantı başarılı.' });
        } else {
            res.status(400).json({ error: testResult.error || 'Bağlantı başarısız.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Bağlantı testi sırasında hata oluştu.' });
    }
});

module.exports = router; 