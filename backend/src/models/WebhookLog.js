const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
    eventType: {
        type: String,
        enum: ['ORDER', 'INVENTORY', 'PRICE'],
        required: true
    },
    payload: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSED', 'FAILED'],
        default: 'PENDING'
    },
    error: {
        message: String,
        stack: String
    },
    retryCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    processedAt: Date
});

module.exports = mongoose.model('WebhookLog', webhookLogSchema); 