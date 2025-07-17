const mongoose = require('mongoose');

// Connect to test DB before all tests
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/sweetshop_test');
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Clear all collections before each test
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const collection of Object.values(collections)) {
    await collection.deleteMany();
  }
});
