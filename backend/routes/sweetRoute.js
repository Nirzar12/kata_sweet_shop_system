const express = require("express");
const Sweet = require("../models/sweet");
const router = express.Router();

// -------------------- Create --------------------

/**
 * POST /api/sweets
 * Add a new sweet
 */
router.post("/", async (req, res) => {
  try {
    const { id, name, category, price, quantity } = req.body;

    // ✅ Check for required fields
    if (!id || !name || !category || !price || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Type and value validations
    if (
      typeof id !== "number" ||
      typeof price !== "number" ||
      typeof quantity !== "number"
    ) {
      return res
        .status(400)
        .json({ error: "ID, price, and quantity must be numbers" });
    }

    if (quantity < 0 || price < 0) {
      return res
        .status(400)
        .json({ error: "Price and quantity must be non-negative numbers" });
    }

    const allowedCategories = [
      "Milk-Based",
      "Nut-Based",
      "Sugar-Based",
      "Fruit-Based",
      "Flour-Based",
    ];
    if (!allowedCategories.includes(category)) {
      return res
        .status(400)
        .json({ error: `${category} is not a valid sweet category` });
    }

    // ❌ Prevent duplicate sweet ID
    const existing = await Sweet.findOne({ id });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Sweet with this ID already exists" });
    }

    // 💾 Save new sweet
    const newSweet = new Sweet({ id, name, category, price, quantity });
    await newSweet.save();

    // ✅ Respond with success
    res
      .status(201)
      .json({ message: "Sweet added successfully", sweet: newSweet });
  } catch (error) {
    // ❌ Catch Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    console.error("❌ Error in POST /api/sweets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------- Delete --------------------

/**
 * DELETE /api/sweets/:id
 * Delete a sweet by ID
 */
router.delete("/:id", async (req, res) => {
  // Add this check at the start of the route
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
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

/**
 * DELETE /api/sweets
 * Delete all sweets
 */
router.delete("/", async (req, res) => {
  await Sweet.deleteMany({});
  res.status(200).json({ message: "All sweets deleted successfully" });
});

// -------------------- Read --------------------

/**
 * GET /api/sweets
 * Get all sweets
 */
router.get("/", async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);
  } catch (error) {
    console.error("❌ Error in GET /api/sweets:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/sweets/search
 * Search sweets by name, category, and price range
 */
router.get("/search", async (req, res) => {
  try {
    const { name, category, priceMin, priceMax } = req.query;

    const filter = {};

    // Case-insensitive partial name match
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    // Exact category match
    if (category) {
      filter.category = category;
    }

    // Validate and apply price range filters
    if (priceMin !== undefined) {
      const min = parseFloat(priceMin);
      if (isNaN(min)) {
        return res.status(400).json({ error: "priceMin must be a number" });
      }
      filter.price = { ...(filter.price || {}), $gte: min };
    }

    if (priceMax !== undefined) {
      const max = parseFloat(priceMax);
      if (isNaN(max)) {
        return res.status(400).json({ error: "priceMax must be a number" });
      }
      filter.price = { ...(filter.price || {}), $lte: max };
    }

    const sweets = await Sweet.find(filter);
    res.status(200).json(sweets);
  } catch (error) {
    console.error("❌ Error in GET /api/sweets/search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------- Update --------------------

/**
 * POST /api/sweets/restock
 * Increase the quantity of an existing sweet
 */
router.post("/restock", async (req, res) => {
  const { id, quantity } = req.body;

  // Validate input
  if (!id || typeof quantity !== "number") {
    return res.status(400).json({ error: "ID and quantity are required" });
  }

  if (quantity <= 0) {
    return res
      .status(400)
      .json({ error: "Quantity must be a positive number" });
  }

  try {
    const sweet = await Sweet.findOne({ id });

    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    sweet.quantity += quantity;
    await sweet.save();

    res.status(200).json({
      message: "Sweet restocked successfully",
      sweet,
    });
  } catch (err) {
    console.error("Error restocking sweet:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/sweets/purchase
 * Purchase a quantity of a sweet
 */
router.post("/purchase", async (req, res) => {
  const { id, quantity } = req.body;

  // 🧪 Validate input presence
  if (id === undefined || quantity === undefined) {
    return res
      .status(400)
      .json({ error: "Sweet ID and quantity are required" });
  }

  // 🧪 Validate that quantity is a positive number
  if (typeof quantity !== "number" || quantity <= 0) {
    return res
      .status(400)
      .json({ error: "Quantity must be a positive number" });
  }

  try {
    // 🔍 Find sweet by ID
    const sweet = await Sweet.findOne({ id });

    // ❌ Sweet not found
    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    // ❌ Not enough stock
    if (sweet.quantity < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    // ✅ Process purchase
    sweet.quantity -= quantity;
    await sweet.save();

    res.status(200).json({
      message: "Purchase successful",
      remainingQuantity: sweet.quantity,
    });
  } catch (err) {
    console.error("❌ Error in /purchase:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
