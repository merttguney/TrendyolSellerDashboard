const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const trendyolService = require('../services/trendyol');

// Stok durumunu getir
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}, 'barcode title quantity stockUpdatedAt');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ürün stok durumunu getir
router.get('/:barcode', async (req, res) => {
  try {
    const product = await Product.findOne(
      { barcode: req.params.barcode },
      'barcode title quantity stockUpdatedAt'
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stok güncelle
router.put('/:barcode', async (req, res) => {
  try {
    const { quantity } = req.body;
    
    // Trendyol'da stok güncelle
    await trendyolService.updateStock(req.params.barcode, quantity);
    
    // Yerel veritabanında stok güncelle
    const product = await Product.findOneAndUpdate(
      { barcode: req.params.barcode },
      { 
        quantity,
        stockUpdatedAt: new Date()
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toplu stok güncelleme
router.put('/batch', async (req, res) => {
  try {
    const { updates } = req.body;
    
    const results = [];
    for (const update of updates) {
      try {
        // Trendyol'da stok güncelle
        await trendyolService.updateStock(update.barcode, update.quantity);
        
        // Yerel veritabanında stok güncelle
        const product = await Product.findOneAndUpdate(
          { barcode: update.barcode },
          { 
            quantity: update.quantity,
            stockUpdatedAt: new Date()
          },
          { new: true }
        );

        results.push({
          barcode: update.barcode,
          success: true,
          product
        });
      } catch (error) {
        results.push({
          barcode: update.barcode,
          success: false,
          error: error.message
        });
      }
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stok senkronizasyonu
router.post('/sync', async (req, res) => {
  try {
    const { page = 0, size = 50 } = req.body;
    
    // Trendyol'dan ürünleri getir
    const trendyolProducts = await trendyolService.getProducts(page, size);
    
    // Yerel veritabanını güncelle
    for (const trendyolProduct of trendyolProducts.content) {
      await Product.findOneAndUpdate(
        { barcode: trendyolProduct.barcode },
        {
          quantity: trendyolProduct.quantity,
          stockUpdatedAt: new Date()
        },
        { new: true }
      );
    }

    res.json({ message: 'Stok başarıyla senkronize edildi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 