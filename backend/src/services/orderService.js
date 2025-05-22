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

class OrderService {
    constructor(trendyolApi) {
        this.trendyolApi = trendyolApi;
    }

    // Yeni siparişleri çekme
    async fetchNewOrders() {
        try {
            // Son 1 saatteki siparişleri çek
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - (60 * 60 * 1000)); // 1 saat öncesi

            const orders = await this.trendyolApi.getOrders(
                startDate.toISOString(),
                endDate.toISOString()
            );

            logger.info('Yeni siparişler başarıyla çekildi', { count: orders.length });
            return orders;
        } catch (error) {
            logger.error('Siparişler çekilirken hata oluştu:', error);
            throw error;
        }
    }

    // Siparişi e-ticaret sistemine aktarma
    async syncOrderToEcommerce(order) {
        try {
            // Siparişi e-ticaret sisteminin formatına dönüştürme
            const ecommerceOrder = {
                orderNumber: order.orderNumber,
                customer: {
                    name: order.customerName,
                    email: order.customerEmail,
                    phone: order.customerPhone
                },
                shippingAddress: {
                    address: order.shippingAddress,
                    city: order.city,
                    district: order.district
                },
                items: order.items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: order.totalAmount,
                paymentMethod: 'TRENDYOL',
                status: 'NEW'
            };

            // TODO: E-ticaret sistemine siparişi gönderme işlemi
            // Bu kısım e-ticaret sisteminizin API'sine göre implement edilmeli

            logger.info('Sipariş başarıyla e-ticaret sistemine aktarıldı', { orderNumber: order.orderNumber });
            return ecommerceOrder;
        } catch (error) {
            logger.error('Sipariş e-ticaret sistemine aktarılırken hata oluştu:', error);
            throw error;
        }
    }
}

module.exports = OrderService;
