const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const trendyolService = require('../services/trendyol');

// Ürünleri listele
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Ürünler listelenirken hata:', error);
    res.status(500).json({ error: 'Ürünler listelenirken bir hata oluştu' });
  }
});

// Ürün detayı getir
router.get('/:barcode', async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ürünleri Trendyol ile senkronize et
router.post('/sync', async (req, res) => {
  try {
    // Trendyol'dan ürünleri al
    const trendyolProducts = await trendyolService.getProducts();
    
    if (!trendyolProducts || !trendyolProducts.content) {
      throw new Error('Trendyol\'dan ürünler alınamadı');
    }

    // Her ürün için
    for (const trendyolProduct of trendyolProducts.content) {
      try {
        // Ürünü veritabanında ara
        let product = await Product.findOne({ barcode: trendyolProduct.barcode });
        
        if (product) {
          // Ürün varsa güncelle
          Object.assign(product, trendyolProduct);
          await product.save();
        } else {
          // Ürün yoksa yeni oluştur
          product = new Product(trendyolProduct);
          await product.save();
        }
      } catch (productError) {
        console.error(`Ürün işlenirken hata (${trendyolProduct.barcode}):`, productError);
        // Hata olsa bile diğer ürünlerle devam et
        continue;
      }
    }
    
    // Güncel ürün listesini döndür
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Ürün senkronizasyonu sırasında hata:', error);
    res.status(500).json({ error: 'Ürünler senkronize edilirken bir hata oluştu' });
  }
});

// Yeni ürün ekle
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Ürün eklenirken hata:', error);
    res.status(400).json({ error: 'Ürün eklenirken bir hata oluştu' });
  }
});

// Ürün güncelle
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }
    res.json(product);
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error);
    res.status(400).json({ error: 'Ürün güncellenirken bir hata oluştu' });
  }
});

// Ürün sil
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }
    res.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    console.error('Ürün silinirken hata:', error);
    res.status(500).json({ error: 'Ürün silinirken bir hata oluştu' });
  }
});

module.exports = router; 