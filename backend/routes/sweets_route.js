const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();

const SWEETS_PATH = path.join(__dirname, '../data/sweets_data.json');

// Utility to read sweets
async function readSweets() {
  const data = await fs.readFile(SWEETS_PATH, 'utf-8');
  return JSON.parse(data);
}

// Utility to write sweets
async function writeSweets(sweets) {
  await fs.writeFile(SWEETS_PATH, JSON.stringify(sweets, null, 2));
}

// POST /api/sweets
router.post('/', async (req, res) => {
  try {
    const { id, name, category, price, quantity } = req.body;

    if (!id || !name || !category || !price || !quantity) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const sweets = await readSweets();

    if (sweets.some(s => String(s.id) === String(id))) {
      return res.status(409).json({ error: 'Sweet with this ID already exists' });
    }

    const newSweet = { id, name, category, price, quantity };
    sweets.push(newSweet);
    await writeSweets(sweets);

    res.status(201).json({ message: 'Sweet added successfully', sweet: newSweet });

  } catch (error) {
    console.error('❌ Error in POST /api/sweets:', error); // 👈 this will help during testing
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
