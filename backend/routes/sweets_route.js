const express = require('express');
const Sweet = require('../models/sweet');
const router = express.Router();

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

// DELETE by ID
router.delete('/:id', async (req, res) => {
  const sweet = await Sweet.findOneAndDelete({ id: req.params.id });
  if (!sweet) {
    return res.status(404).json({ error: `Sweet with ID ${req.params.id} not found` });
  }
  res.status(200).json({ message: `Sweet with ID ${req.params.id} deleted successfully` });
});

// DELETE all
router.delete('/', async (req, res) => {
  await Sweet.deleteMany({});
  res.status(200).json({ message: 'All sweets deleted successfully' });
});

// GET /api/sweets - View all sweets
router.get('/', async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);
  } catch (error) {
    console.error('❌ Error in GET /api/sweets:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sweets/search?name=ras&category=Milk-Based&priceMin=10&priceMax=50
router.get('/search', async (req, res) => {
  try {
    const { name, category, priceMin, priceMax } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // partial match, case-insensitive
    }

    if (category) {
      filter.category = category;
    }

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    const sweets = await Sweet.find(filter);
    res.status(200).json(sweets);
  } catch (error) {
    console.error('❌ Error in GET /api/sweets/search:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
