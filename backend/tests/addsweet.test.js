const request = require('supertest');
const Sweet = require('../models/sweet');
const app = require('../app');

describe('Add Sweets API', () => {
  // Reset DB before each test
  beforeEach(async () => {
    await Sweet.deleteMany({});
  });

  // ✅ Valid sweet
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

  // ❌ Missing fields
  it('should return 400 if required fields are missing', async () => {
    const incompleteSweet = {
      name: 'Barfi',
      price: 15,
    };

    const res = await request(app).post('/api/sweets').send(incompleteSweet);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // ❌ Duplicate ID
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

  // ❌ Invalid category
  it('should return 400 for invalid sweet category', async () => {
    const invalidCategorySweet = {
      id: 1005,
      name: 'Mystery Sweet',
      category: 'Spicy-Based', // Invalid
      price: 15,
      quantity: 10,
    };

    const res = await request(app).post('/api/sweets').send(invalidCategorySweet);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // ❌ Non-numeric price
  it('should return 400 if price is not a number', async () => {
    const invalidPriceSweet = {
      id: 1006,
      name: 'Ladoo',
      category: 'Sugar-Based',
      price: 'twenty', // Invalid
      quantity: 10,
    };

    const res = await request(app).post('/api/sweets').send(invalidPriceSweet);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // ❌ Negative quantity
  it('should return 400 if quantity is negative', async () => {
    const invalidQuantitySweet = {
      id: 1007,
      name: 'Halwa',
      category: 'Milk-Based',
      price: 30,
      quantity: -5, // Invalid
    };

    const res = await request(app).post('/api/sweets').send(invalidQuantitySweet);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
