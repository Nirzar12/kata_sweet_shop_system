const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: {
      values: ['Milk-Based', 'Nut-Based', 'Sugar-Based', 'Fruit-Based', 'Flour-Based'],
      message: '{VALUE} is not a valid sweet category'
    }
  },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

module.exports = mongoose.models.Sweet || mongoose.model('Sweet', sweetSchema);
