require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Settings = require('../models/Settings');

// Test verisi oluşturma
async function createTestData() {
    try {
        // Önce mevcut verileri temizle
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Settings.deleteMany({});
        console.log('Mevcut test verileri temizlendi');

        // Test ürünleri oluştur
        const products = await Product.create([
            {
                barcode: 'TEST123',
                title: 'Test Ürünü 1',
                productMainId: 'TEST123',
                quantity: 100,
                currencyType: 'TRY',
                listPrice: 199.99,
                salePrice: 149.99,
                vatRate: 18,
                cargoCompanyId: 1,
                images: [{ url: 'https://example.com/image1.jpg' }]
            },
            {
                barcode: 'TEST456',
                title: 'Test Ürünü 2',
                productMainId: 'TEST456',
                quantity: 50,
                currencyType: 'TRY',
                listPrice: 299.99,
                salePrice: 249.99,
                vatRate: 18,
                cargoCompanyId: 1,
                images: [{ url: 'https://example.com/image2.jpg' }]
            }
        ]);
        console.log('Test ürünleri oluşturuldu:', products.length);

        // Test siparişleri oluştur
        const orders = await Order.create([
            {
                orderNumber: 'ORDER123',
                customer: 'Test Müşteri 1',
                date: new Date(),
                total: 399.98,
                status: 'Yeni',
                items: [{
                    productId: products[0]._id,
                    quantity: 2,
                    price: products[0].salePrice
                }]
            },
            {
                orderNumber: 'ORDER456',
                customer: 'Test Müşteri 2',
                date: new Date(),
                total: 249.99,
                status: 'İşleniyor',
                items: [{
                    productId: products[1]._id,
                    quantity: 1,
                    price: products[1].salePrice
                }]
            }
        ]);
        console.log('Test siparişleri oluşturuldu:', orders.length);

        // Test ayarları oluştur
        const settings = await Settings.create({
            apiKey: 'test-api-key',
            apiSecret: 'test-api-secret',
            supplierId: 'test-supplier-id',
            webhookUrl: 'http://localhost:5002/webhook',
            autoSync: true,
            syncInterval: 30,
            minStockAlert: 10,
            stockUpdateInterval: 5,
            orderCheckInterval: 5
        });
        console.log('Test ayarları oluşturuldu');

    } catch (error) {
        console.error('Test verisi oluşturulurken hata:', error);
    }
}

// Veritabanı bağlantısı ve test
async function runTest() {
    try {
        await mongoose.connect('mongodb://localhost:27017/trendyol-integration');
        console.log('MongoDB bağlantısı başarılı');

        // Test verisi oluştur
        await createTestData();

        // Tüm verileri listele
        const products = await Product.find();
        const orders = await Order.find();
        const settings = await Settings.find();

        console.log('\nTüm Ürünler:', JSON.stringify(products, null, 2));
        console.log('\nTüm Siparişler:', JSON.stringify(orders, null, 2));
        console.log('\nTüm Ayarlar:', JSON.stringify(settings, null, 2));

    } catch (error) {
        console.error('Test sırasında hata:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB bağlantısı kapatıldı');
    }
}

// Testi çalıştır
runTest(); 