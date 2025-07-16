const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const sweetSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const Sweet = mongoose.models.Sweet || mongoose.model('Sweet', sweetSchema);

// POST /api/sweets
router.post('/', async (req, res) => {
  try {
    const { id, name, category, price, quantity } = req.body;

    if (!id || !name || !category || !price || !quantity) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await Sweet.findOne({ id });
    if (existing) {
      return res.status(409).json({ error: 'Sweet with this ID already exists' });
    }

    const newSweet = new Sweet({ id, name, category, price, quantity });
    await newSweet.save();

    res.status(201).json({ message: 'Sweet added successfully', sweet: newSweet });
  } catch (error) {
    console.error('❌ Error in POST /api/sweets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





module.exports = router;
