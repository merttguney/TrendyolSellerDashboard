const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const trendyolService = require('../services/trendyol');

// Siparişleri listele
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, page = 0, size = 50 } = req.query;
    
    // Trendyol'dan siparişleri getir
    const trendyolOrders = await trendyolService.getOrders(startDate, endDate, page, size);
    
    // Yerel veritabanındaki siparişleri güncelle
    for (const trendyolOrder of trendyolOrders.content) {
      await Order.findOneAndUpdate(
        { orderId: trendyolOrder.id },
        {
          orderId: trendyolOrder.id,
          status: trendyolOrder.status,
          customerId: trendyolOrder.customerId,
          totalPrice: trendyolOrder.totalPrice,
          items: trendyolOrder.items.map(item => ({
            barcode: item.barcode,
            title: item.title,
            quantity: item.quantity,
            price: item.price
          }))
        },
        { upsert: true, new: true }
      );
    }

    // Güncel siparişleri getir
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(page * size)
      .limit(size);

    res.json({
      content: orders,
      totalElements: await Order.countDocuments(),
      totalPages: Math.ceil(await Order.countDocuments() / size),
      page,
      size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sipariş detayı getir
router.get('/:orderId', async (req, res) => {
  try {
    // Önce yerel veritabanından kontrol et
    let order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      // Trendyol'dan sipariş detaylarını getir
      const trendyolOrder = await trendyolService.getOrderDetails(req.params.orderId);
      
      // Yerel veritabanına kaydet
      order = await Order.create({
        orderId: trendyolOrder.id,
        status: trendyolOrder.status,
        customerId: trendyolOrder.customerId,
        totalPrice: trendyolOrder.totalPrice,
        items: trendyolOrder.items.map(item => ({
          barcode: item.barcode,
          title: item.title,
          quantity: item.quantity,
          price: item.price
        }))
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sipariş durumunu güncelle
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Trendyol'da sipariş durumunu güncelle
    await trendyolService.updateOrderStatus(req.params.orderId, status);
    
    // Yerel veritabanında sipariş durumunu güncelle
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Sipariş bulunamadı' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Siparişleri senkronize et
router.post('/sync', async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    // Trendyol'dan siparişleri getir
    const trendyolOrders = await trendyolService.getOrders(startDate, endDate);
    
    // Yerel veritabanını güncelle
    for (const trendyolOrder of trendyolOrders.content) {
      await Order.findOneAndUpdate(
        { orderId: trendyolOrder.id },
        {
          orderId: trendyolOrder.id,
          status: trendyolOrder.status,
          customerId: trendyolOrder.customerId,
          totalPrice: trendyolOrder.totalPrice,
          items: trendyolOrder.items.map(item => ({
            barcode: item.barcode,
            title: item.title,
            quantity: item.quantity,
            price: item.price
          }))
        },
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Siparişler başarıyla senkronize edildi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 