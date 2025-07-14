const SalesDetail = require('../models/SalesDetails');
const User = require('../models/userModel');

// Create a new sales detail
const createSalesDetail = async (req, res) => {
  try {
    const { product, productId, quantity, price, date, buyer } = req.body;

    const newSalesDetail = new SalesDetail({
      product,
      productId,
      quantity,
      price,
      date,
      buyer
    });

    const savedSalesDetail = await newSalesDetail.save();
    res.status(201).json(savedSalesDetail);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sales detail', error });
  }
};

// Get all sales details
const getAllSalesDetails = async (req, res) => {
  try {
    const salesDetails = await SalesDetail.find().populate('buyer', 'username');
    res.status(200).json(salesDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales details', error });
  }
};

// Get a single sales detail by ID
const getSalesDetailById = async (req, res) => {
  try {
    const salesDetail = await SalesDetail.findById(req.params.id).populate('buyer', 'username');

    if (!salesDetail) {
      return res.status(404).json({ message: 'Sales detail not found' });
    }

    res.status(200).json(salesDetail);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales detail', error });
  }
};

// Update a sales detail by ID
const updateSalesDetailById = async (req, res) => {
  try {
    const { product, quantity, price, date } = req.body;

    const updatedSalesDetail = await SalesDetail.findByIdAndUpdate(
      req.params.id,
      { product, quantity, price, date },
      { new: true, runValidators: true }
    );

    if (!updatedSalesDetail) {
      return res.status(404).json({ message: 'Sales detail not found' });
    }

    res.status(200).json(updatedSalesDetail);
  } catch (error) {
    res.status(500).json({ message: 'Error updating sales detail', error });
  }
};

// Delete a sales detail by ID
const deleteSalesDetailById = async (req, res) => {
  try {
    const deletedSalesDetail = await SalesDetail.findByIdAndDelete(req.params.id);

    if (!deletedSalesDetail) {
      return res.status(404).json({ message: 'Sales detail not found' });
    }

    res.status(200).json({ message: 'Sales detail deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sales detail', error });
  }
};

// Get purchase history for a user (by userId)
const getPurchaseHistoryForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all sales where buyer matches the logged-in user
    const sales = await SalesDetail.find({ buyer: userId }).sort({ date: -1 });
    res.json({ history: sales });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase history', error });
  }
};

module.exports = {
  createSalesDetail,
  getAllSalesDetails,
  getSalesDetailById,
  updateSalesDetailById,
  deleteSalesDetailById,
  getPurchaseHistoryForUser
};