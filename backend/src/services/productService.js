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

class ProductService {
    constructor(trendyolApi) {
        this.trendyolApi = trendyolApi;
    }

    // E-ticaret sisteminden ürünleri çekip Trendyol'a aktarma
    async syncProductsToTrendyol(products) {
        try {
            // Her ürün için Trendyol formatına dönüştürme
            const trendyolProducts = products.map(product => ({
                barcode: product.barcode,
                title: product.name,
                productMainId: product.sku,
                brandId: product.brandId,
                categoryId: product.categoryId,
                quantity: product.stock,
                stockCode: product.sku,
                dimensionalWeight: product.weight,
                description: product.description,
                currencyType: "TRY",
                listPrice: product.price,
                salePrice: product.salePrice,
                vatRate: 18,
                cargoCompanyId: 1,
                images: product.images.map(img => ({ url: img }))
            }));

            // Toplu ürün güncelleme
            const result = await this.trendyolApi.updateProduct({
                items: trendyolProducts
            });

            logger.info('Ürünler başarıyla Trendyol\'a aktarıldı', { count: trendyolProducts.length });
            return result;
        } catch (error) {
            logger.error('Ürün aktarımı sırasında hata oluştu:', error);
            throw error;
        }
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
}

module.exports = ProductService;
