const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

const app = express();
const PORT = process.env.WEBHOOK_PORT || 5002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const { eventType, data } = req.body;
    console.log('Webhook received:', { eventType, data });

    switch (eventType) {
      case 'ORDER_STATUS_CHANGED':
        await handleOrderStatusChange(data);
        break;
      case 'PRODUCT_STOCK_UPDATED':
        await handleStockUpdate(data);
        break;
      default:
        console.log('Unknown event type:', eventType);
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle order status changes
async function handleOrderStatusChange(data) {
  const { orderId, status } = data;
  await Order.findOneAndUpdate(
    { orderId },
    { status },
    { new: true }
  );
  console.log(`Order ${orderId} status updated to ${status}`);
}

// Handle stock updates
async function handleStockUpdate(data) {
  const { barcode, quantity } = data;
  await Product.findOneAndUpdate(
    { barcode },
    { 
      quantity,
      stockUpdatedAt: new Date()
    },
    { new: true }
  );
  console.log(`Product ${barcode} stock updated to ${quantity}`);
}

// Start server
app.listen(PORT, () => {
  console.log(`Webhook service listening on port ${PORT}`);
}); 