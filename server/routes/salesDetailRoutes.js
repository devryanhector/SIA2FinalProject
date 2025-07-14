const express = require('express');
const {
  createSalesDetail,
  getAllSalesDetails,
  getSalesDetailById,
  updateSalesDetailById,
  deleteSalesDetailById,
  getPurchaseHistoryForUser
} = require('../controllers/salesDetailController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create a new sales detail
router.post('/', createSalesDetail);

// Route to get all sales details
router.get('/', getAllSalesDetails);

// Route to get a sales detail by ID
router.get('/:id', getSalesDetailById);

// Route to update a sales detail by ID
router.put('/:id', updateSalesDetailById);

// Route to delete a sales detail by ID
router.delete('/:id', deleteSalesDetailById);

// Route to get purchase history for logged-in user
router.get('/user/history', authMiddleware, getPurchaseHistoryForUser);

module.exports = router;