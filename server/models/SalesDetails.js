const mongoose = require('mongoose');

const salesDetailSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: false
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const SalesDetail = mongoose.model('SalesDetail', salesDetailSchema);

module.exports = SalesDetail;