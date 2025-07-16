const request = require('supertest');
const Sweet = require('../models/sweet');
const app = require('../app');

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
