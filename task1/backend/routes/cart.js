const express = require('express');
const router = express.Router();

let cartData = {}; // In-memory cart data
const CartItem = require('../models/CartItem');

// Add item to cart
router.post('/add', (req, res) => {
  const { userId, productId, name, price, image, qty } = req.body;

  if (!userId || !productId || !name || !price || !image || !qty) {
    return res.status(400).json({ message: 'Missing fields in request body' });
  }

  if (!cartData[userId]) {
    cartData[userId] = [];
  }

  const existingItem = cartData[userId].find(item => item.productId === productId);
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cartData[userId].push({ productId, name, price, image, qty });
  }

  res.status(200).json({ message: 'Item added to cart', cart: cartData[userId] });
});

// Get cart items for a user
router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  const userCart = cartData[userId] || [];
  res.status(200).json(userCart);
});

// module.exports = router;

router.delete('/clear/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    await CartItem.deleteMany({ userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;