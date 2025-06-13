const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const ObjectId = mongoose.Types.ObjectId;

router.post('/', async (req, res) => {
  try {
    const { userId, items, totalPrice } = req.body;

    if (!userId || !items || !totalPrice) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const fixedItems = items.map(item => ({
      productId: new ObjectId(item.productId),
      qty: item.qty,
      name: item.name,
      price: item.price,
      image: item.image
    }));

    const order = new Order({
      userId,
      items: fixedItems,
      totalPrice
    });

    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
