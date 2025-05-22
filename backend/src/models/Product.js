const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true,
        unique: true
    },
    title: String,
    productMainId: String,
    brandId: Number,
    categoryId: Number,
    quantity: {
        type: Number,
        default: 0
    },
    stockCode: String,
    dimensionalWeight: Number,
    description: String,
    currencyType: {
        type: String,
        default: 'TRY'
    },
    listPrice: Number,
    salePrice: Number,
    vatRate: {
        type: Number,
        default: 18
    },
    cargoCompanyId: {
        type: Number,
        default: 1
    },
    images: [{
        url: String
    }],
    lastStockUpdate: {
        type: Date,
        default: Date.now
    },
    lastPriceUpdate: {
        type: Date,
        default: Date.now
    }
});

// Stok güncelleme tarihini otomatik güncelle
productSchema.pre('save', function(next) {
    if (this.isModified('quantity')) {
        this.lastStockUpdate = new Date();
    }
    if (this.isModified('listPrice') || this.isModified('salePrice')) {
        this.lastPriceUpdate = new Date();
    }
    next();
});

module.exports = mongoose.model('Product', productSchema); 