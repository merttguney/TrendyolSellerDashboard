const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    apiKey: {
        type: String,
        default: ''
    },
    apiSecret: {
        type: String,
        default: ''
    },
    supplierId: {
        type: String,
        default: ''
    },
    webhookUrl: {
        type: String,
        default: ''
    },
    autoSync: {
        type: Boolean,
        default: false
    },
    syncInterval: {
        type: Number,
        default: 30
    },
    minStockAlert: {
        type: Number,
        default: 10
    },
    stockUpdateInterval: {
        type: Number,
        default: 5
    },
    orderCheckInterval: {
        type: Number,
        default: 5
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema); 