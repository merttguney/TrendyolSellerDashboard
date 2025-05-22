require('dotenv').config();
const express = require('express');
const cors = require('cors');
const TrendyolAPI = require('./utils/trendyolApi');
const ProductService = require('./services/productService');
const OrderService = require('./services/orderService');
const StockService = require('./services/stockService');
const WebhookService = require('./services/webhookService');
const connectDB = require('./config/database');
const winston = require('winston');

// Logger yapılandırması
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Veritabanı bağlantısı
connectDB();

// Express uygulamasını başlat
const app = express();
const PORT = process.env.PORT || 5001;

// CORS'u aç (tüm kaynaklara izin ver)
app.use(cors());

// JSON body parse
app.use(express.json());

// API route'larını ekle
app.use('/api/products', require('./api/products'));
app.use('/api/orders', require('./api/orders'));
app.use('/api/stock', require('./api/stock'));
app.use('/api/settings', require('./api/settings'));

// Trendyol API bağlantısı ve servisler (diğer servisler için mevcut kodlar)
const trendyolApi = new TrendyolAPI(
    process.env.TRENDYOL_SUPPLIER_ID,
    process.env.TRENDYOL_API_KEY,
    process.env.TRENDYOL_API_SECRET
);
const productService = new ProductService(trendyolApi);
const orderService = new OrderService(trendyolApi);
const stockService = new StockService(trendyolApi);

// Webhook servisini başlat (opsiyonel, ayrı portta çalışıyor)
const webhookService = new WebhookService(process.env.WEBHOOK_PORT || 5002);
webhookService.start();

// Periyodik görevler (cron) - mevcut kodlar
const cron = require('node-cron');
cron.schedule('*/5 * * * *', async () => {
    try {
        const orders = await orderService.fetchNewOrders();
        logger.info('Periyodik sipariş kontrolü tamamlandı', { count: orders.length });
    } catch (error) {
        logger.error('Periyodik sipariş kontrolü sırasında hata:', error);
    }
});
cron.schedule('0 * * * *', async () => {
    try {
        logger.info('Periyodik stok kontrolü başlatıldı');
    } catch (error) {
        logger.error('Periyodik stok kontrolü sırasında hata:', error);
    }
});

// Express sunucusunu başlat
app.listen(PORT, () => {
    logger.info(`API sunucusu ${PORT} portunda başlatıldı`);
    console.log(`API sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});

logger.info('Uygulama başlatıldı'); 