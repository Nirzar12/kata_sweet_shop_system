const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const sweetSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const Sweet = mongoose.models.Sweet || mongoose.model("Sweet", sweetSchema);

// POST /api/sweets
router.post("/", async (req, res) => {
  try {
    const { id, name, category, price, quantity } = req.body;

    if (!id || !name || !category || !price || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await Sweet.findOne({ id });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Sweet with this ID already exists" });
    }

    const newSweet = new Sweet({ id, name, category, price, quantity });
    await newSweet.save();

    res
      .status(201)
      .json({ message: "Sweet added successfully", sweet: newSweet });
  } catch (error) {
    console.error("❌ Error in POST /api/sweets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE by ID
router.delete("/:id", async (req, res) => {
  const sweet = await Sweet.findOneAndDelete({ id: req.params.id });
  if (!sweet) {
    return res
      .status(404)
      .json({ error: `Sweet with ID ${req.params.id} not found` });
  }
  res
    .status(200)
    .json({ message: `Sweet with ID ${req.params.id} deleted successfully` });
});

// DELETE all
router.delete("/", async (req, res) => {
  await Sweet.deleteMany({});
  res.status(200).json({ message: "All sweets deleted successfully" });
});

module.exports = router;
