const mongoose = require('mongoose');
const app = require('./app');

if (require.main === module) {
  mongoose.connect('mongodb://localhost:27017/sweetshop').then(() => {
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  }).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
}
