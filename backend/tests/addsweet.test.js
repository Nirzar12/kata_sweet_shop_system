const request = require('supertest');
const mongoose = require('mongoose');
const Sweet = require('../models/sweet');
const app = require('../app');

let originalData = [];

beforeAll(async () => {
  // ✅ Connect to MongoDB test database
  await mongoose.connect('mongodb://localhost:27017/sweetshop_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // 🟡 Backup current DB content (if any)
  originalData = await Sweet.find().lean();
});

beforeEach(async () => {
  // 🧪 Reset DB to original content before each test
  await Sweet.deleteMany({}); // Clear MongoDB collection before each test
});

describe('Add Sweets API', () => {
  it('should add a new sweet successfully', async () => {
    const newSweet = {
      id: 1004,
      name: 'Rasgulla',
      category: 'Milk-Based',
      price: 20,
      quantity: 25,
    };

    const res = await request(app).post('/api/sweets').send(newSweet);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Sweet added successfully',
        sweet: expect.objectContaining(newSweet),
      })
    );
  });

  it('should return 400 if required fields are missing', async () => {
    const incompleteSweet = {
      name: 'Barfi',
      price: 15,
    };

    const res = await request(app).post('/api/sweets').send(incompleteSweet);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not add duplicate sweet ID', async () => {
    const originalSweet = {
      id: 1004,
      name: 'Rasgulla',
      category: 'Milk-Based',
      price: 20,
      quantity: 25,
    };

    await request(app).post('/api/sweets').send(originalSweet);

    const duplicateSweet = {
      id: 1004,
      name: 'Rasgulla Duplicate',
      category: 'Milk-Based',
      price: 25,
      quantity: 10,
    };

    const res = await request(app).post('/api/sweets').send(duplicateSweet);

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error', 'Sweet with this ID already exists');
  });
});

afterAll(async () => {
  // 🔁 Restore original DB content
  await Sweet.deleteMany();
  if (originalData.length > 0) {
    await Sweet.insertMany(originalData);
  }

  // 🔌 Close DB connection
  await mongoose.connection.close();
});
