const axios = require('axios');
const crypto = require('crypto');
const Settings = require('../models/Settings');

// Mock data
const mockProducts = [
  {
    barcode: 'TEST001',
    title: 'Test Ürün 1',
    productMainId: 'TP001',
    quantity: 100,
    salePrice: 199.99,
    listPrice: 249.99,
    vatRate: 18,
    images: [{ url: 'https://via.placeholder.com/150' }]
  },
  {
    barcode: 'TEST002',
    title: 'Test Ürün 2',
    productMainId: 'TP002',
    quantity: 50,
    salePrice: 299.99,
    listPrice: 349.99,
    vatRate: 18,
    images: [{ url: 'https://via.placeholder.com/150' }]
  }
];

const mockOrders = [
  {
    id: 'ORD001',
    status: 'PENDING',
    customerId: 'CUST001',
    totalPrice: 199.99,
    items: [
      {
        barcode: 'TEST001',
        title: 'Test Ürün 1',
        quantity: 1,
        price: 199.99
      }
    ]
  },
  {
    id: 'ORD002',
    status: 'SHIPPED',
    customerId: 'CUST002',
    totalPrice: 299.99,
    items: [
      {
        barcode: 'TEST002',
        title: 'Test Ürün 2',
        quantity: 1,
        price: 299.99
      }
    ]
  }
];

class TrendyolService {
  constructor() {
    this.baseUrl = 'https://api.trendyol.com/sapigw';
    this.supplierId = 'TEST123';
    this.apiKey = 'test-api-key';
    this.apiSecret = 'test-api-secret';
  }

  // API kimlik bilgilerini ayarla
  async initialize() {
    try {
      const settings = await Settings.findOne();
      if (settings) {
        this.supplierId = settings.supplierId || this.supplierId;
        this.apiKey = settings.apiKey || this.apiKey;
        this.apiSecret = settings.apiSecret || this.apiSecret;
      }
    } catch (error) {
      console.error('Trendyol servisi başlatılamadı:', error);
      // Mock data kullanacağımız için hata fırlatmıyoruz
    }
  }

  // İmza oluştur
  generateSignature(timestamp) {
    const data = `${this.apiKey}${timestamp}`;
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(data)
      .digest('base64');
  }

  // API isteği gönder
  async makeRequest(method, endpoint, data = null) {
    try {
      await this.initialize();
      console.log(`Mock API Request: ${method} ${endpoint}`, data);
      
      // Gerçek API çağrısı yerine mock data dönüyoruz
      return this.handleMockRequest(method, endpoint, data);
    } catch (error) {
      console.error('Trendyol API isteği başarısız:', error);
      throw error;
    }
  }

  // Mock istekleri işle
  handleMockRequest(method, endpoint, data) {
    if (endpoint.includes('/products')) {
      if (method === 'GET') {
        return {
          content: mockProducts,
          totalElements: mockProducts.length,
          totalPages: 1,
          page: 0,
          size: 50
        };
      } else if (method === 'PUT') {
        const { items } = data;
        items.forEach(item => {
          const product = mockProducts.find(p => p.barcode === item.barcode);
          if (product) {
            Object.assign(product, item);
          }
        });
        return { success: true };
      }
    } else if (endpoint.includes('/orders')) {
      if (method === 'GET') {
        return {
          content: mockOrders,
          totalElements: mockOrders.length,
          totalPages: 1,
          page: 0,
          size: 50
        };
      } else if (method === 'PUT' && endpoint.includes('/status')) {
        const orderId = endpoint.split('/').pop();
        const order = mockOrders.find(o => o.id === orderId);
        if (order) {
          order.status = data.status;
        }
        return { success: true };
      }
    }
    return { success: true };
  }

  // Ürünleri getir
  async getProducts(page = 0, size = 50) {
    return this.makeRequest('GET', `/suppliers/${this.supplierId}/products?page=${page}&size=${size}`);
  }

  // Ürün güncelle
  async updateProduct(barcode, data) {
    return this.makeRequest('PUT', `/suppliers/${this.supplierId}/products/price-and-inventory`, {
      items: [{
        barcode,
        ...data
      }]
    });
  }

  // Siparişleri getir
  async getOrders(startDate, endDate, page = 0, size = 50) {
    const endpoint = `/suppliers/${this.supplierId}/orders?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`;
    return this.makeRequest('GET', endpoint);
  }

  // Sipariş detaylarını getir
  async getOrderDetails(orderId) {
    return this.makeRequest('GET', `/suppliers/${this.supplierId}/orders/${orderId}`);
  }

  // Sipariş durumunu güncelle
  async updateOrderStatus(orderId, status) {
    return this.makeRequest('PUT', `/suppliers/${this.supplierId}/orders/${orderId}/status`, {
      status
    });
  }

  // Stok güncelle
  async updateStock(barcode, quantity) {
    return this.updateProduct(barcode, { quantity });
  }

  // Fiyat güncelle
  async updatePrice(barcode, salePrice, listPrice) {
    return this.updateProduct(barcode, { salePrice, listPrice });
  }
}

module.exports = new TrendyolService(); 