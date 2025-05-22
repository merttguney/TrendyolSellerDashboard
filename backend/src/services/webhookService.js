const express = require('express');
const winston = require('winston');
const crypto = require('crypto');

// Logger yapılandırması
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

class WebhookService {
    constructor(port = 5002) {
        this.app = express();
        this.port = port;
        this.setupMiddleware();
        this.setupRoutes();
    }

    // Middleware ayarları
    setupMiddleware() {
        this.app.use(express.json());
        
        // Webhook güvenliği için imza doğrulama
        this.app.use((req, res, next) => {
            const signature = req.headers['x-trendyol-signature'];
            const payload = JSON.stringify(req.body);
            
            // Webhook secret'ı .env'den alınmalı
            const secret = process.env.TRENDYOL_WEBHOOK_SECRET;
            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(payload)
                .digest('hex');

            if (signature !== expectedSignature) {
                logger.error('Geçersiz webhook imzası');
                return res.status(401).json({ error: 'Geçersiz imza' });
            }
            next();
        });
    }

    // Webhook endpoint'lerini ayarla
    setupRoutes() {
        // Sipariş webhook'u
        this.app.post('/webhook/orders', async (req, res) => {
            try {
                const orderData = req.body;
                logger.info('Yeni sipariş webhook\'u alındı', { orderId: orderData.orderId });

                // Sipariş işleme mantığı burada olacak
                // Örnek: OrderService'e iletme
                // await this.orderService.processWebhookOrder(orderData);

                res.status(200).json({ message: 'Webhook başarıyla işlendi' });
            } catch (error) {
                logger.error('Sipariş webhook\'u işlenirken hata:', error);
                res.status(500).json({ error: 'İşlem sırasında hata oluştu' });
            }
        });

        // Stok webhook'u
        this.app.post('/webhook/inventory', async (req, res) => {
            try {
                const inventoryData = req.body;
                logger.info('Stok güncelleme webhook\'u alındı', { 
                    productId: inventoryData.productId,
                    newQuantity: inventoryData.quantity 
                });

                // Stok güncelleme mantığı burada olacak
                // Örnek: StockService'e iletme
                // await this.stockService.processWebhookInventory(inventoryData);

                res.status(200).json({ message: 'Webhook başarıyla işlendi' });
            } catch (error) {
                logger.error('Stok webhook\'u işlenirken hata:', error);
                res.status(500).json({ error: 'İşlem sırasında hata oluştu' });
            }
        });

        // Fiyat webhook'u
        this.app.post('/webhook/prices', async (req, res) => {
            try {
                const priceData = req.body;
                logger.info('Fiyat güncelleme webhook\'u alındı', { 
                    productId: priceData.productId,
                    newPrice: priceData.price 
                });

                // Fiyat güncelleme mantığı burada olacak
                // Örnek: ProductService'e iletme
                // await this.productService.processWebhookPrice(priceData);

                res.status(200).json({ message: 'Webhook başarıyla işlendi' });
            } catch (error) {
                logger.error('Fiyat webhook\'u işlenirken hata:', error);
                res.status(500).json({ error: 'İşlem sırasında hata oluştu' });
            }
        });
    }

    // Webhook sunucusunu başlat
    start() {
        this.app.listen(this.port, () => {
            logger.info(`Webhook sunucusu ${this.port} portunda başlatıldı`);
        });
    }
}

module.exports = WebhookService; 