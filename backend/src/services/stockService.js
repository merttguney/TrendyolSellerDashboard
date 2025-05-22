const TrendyolAPI = require('../utils/trendyolApi');
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

class StockService {
    constructor(trendyolApi) {
        this.trendyolApi = trendyolApi;
    }

    // Stok güncelleme
    async updateStock(productId, quantity) {
        try {
            const result = await this.trendyolApi.updateProduct({
                items: [{
                    barcode: productId,
                    quantity: quantity
                }]
            });

            logger.info('Stok başarıyla güncellendi', { productId, quantity });
            return result;
        } catch (error) {
            logger.error('Stok güncellenirken hata oluştu:', error);
            throw error;
        }
    }

    // Toplu stok güncelleme
    async bulkUpdateStock(stockUpdates) {
        try {
            const items = stockUpdates.map(update => ({
                barcode: update.productId,
                quantity: update.quantity
            }));

            const result = await this.trendyolApi.updateProduct({ items });

            logger.info('Toplu stok güncelleme başarılı', { count: items.length });
            return result;
        } catch (error) {
            logger.error('Toplu stok güncelleme sırasında hata oluştu:', error);
            throw error;
        }
    }

    // Stok kontrolü
    async checkStock(productId) {
        try {
            const products = await this.trendyolApi.getProducts();
            const product = products.find(p => p.barcode === productId);
            
            if (!product) {
                throw new Error('Ürün bulunamadı');
            }

            return {
                productId,
                currentStock: product.quantity,
                lastUpdated: new Date()
            };
        } catch (error) {
            logger.error('Stok kontrolü sırasında hata oluştu:', error);
            throw error;
        }
    }
}

module.exports = StockService;
