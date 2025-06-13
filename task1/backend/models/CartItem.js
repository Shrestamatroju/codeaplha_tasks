const mongoose = require('mongoose');
const CartItemSchema = new mongoose.Schema({
  userId: String,
  productId: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  image: String,
  qty: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('CartItem', CartItemSchema);
