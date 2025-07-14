const express = require('express');
const router = express.Router();
const Product = require('../models/productModel'); // Adjust path if needed

// Get a single product by ID
router.get('/getproduct/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ data: product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
