const axios = require('axios');
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

class TrendyolAPI {
    constructor(supplierId, apiKey, apiSecret) {
        this.supplierId = supplierId;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.baseUrl = 'https://api.trendyol.com/sapigw';
    }

    // API istekleri için gerekli headers
    getHeaders() {
        return {
            'Authorization': `Basic ${Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64')}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Trendyol-Integration/1.0'
        };
    }

    // Ürün listesi çekme
    async getProducts(page = 0, size = 50) {
        try {
            const response = await axios.get(`${this.baseUrl}/suppliers/${this.supplierId}/products`, {
                headers: this.getHeaders(),
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            logger.error('Ürün listesi çekilirken hata oluştu:', error);
            throw error;
        }
    }

    // Ürün güncelleme
    async updateProduct(productData) {
        try {
            const response = await axios.put(
                `${this.baseUrl}/suppliers/${this.supplierId}/products/price-and-inventory`,
                productData,
                { headers: this.getHeaders() }
            );
            return response.data;
        } catch (error) {
            logger.error('Ürün güncellenirken hata oluştu:', error);
            throw error;
        }
    }

    // Siparişleri çekme
    async getOrders(startDate, endDate, page = 0, size = 50) {
        try {
            const response = await axios.get(`${this.baseUrl}/suppliers/${this.supplierId}/orders`, {
                headers: this.getHeaders(),
                params: {
                    startDate,
                    endDate,
                    page,
                    size
                }
            });
            return response.data;
        } catch (error) {
            logger.error('Siparişler çekilirken hata oluştu:', error);
            throw error;
        }
    }
}

module.exports = TrendyolAPI;
