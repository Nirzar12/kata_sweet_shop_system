const mongoose = require('mongoose');

// Sweet schema definition
const sweetSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Unique sweet ID
  name: { type: String, required: true },             // Name of the sweet
  category: {
    type: String,
    required: true,
    enum: {
      values: ['Milk-Based', 'Nut-Based', 'Sugar-Based', 'Fruit-Based', 'Flour-Based'],
      message: '{VALUE} is not a valid sweet category', // Custom error message for invalid category
    },
  },
  price: { type: Number, required: true },            // Price per unit
  quantity: { type: Number, required: true },         // Available quantity
});

// Export model or reuse existing one (prevents overwrite in hot reloads)
module.exports = mongoose.models.Sweet || mongoose.model('Sweet', sweetSchema);
