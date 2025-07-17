const request = require('supertest');
const Sweet = require('../models/sweet');
const app = require('../app');

describe('Restock Sweet API', () => {
  const testSweet = {
    id: 2001,
    name: 'Kaju Katli',
    category: 'Dry Fruit',
    price: 50,
    quantity: 10,
  };

  beforeAll(async () => {
    // Ensure test sweet exists before restocking
    await Sweet.deleteMany({ id: testSweet.id }); // Clear if exists
    await request(app).post('/api/sweets').send(testSweet);
  });

  it('should restock a sweet successfully', async () => {
    const restockPayload = {
      id: 2001,
      quantity: 15,
    };

    const res = await request(app).post('/api/sweets/restock').send(restockPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Sweet restocked successfully',
        sweet: expect.objectContaining({
          id: 2001,
          quantity: 25, // original 10 + 15 restocked
        }),
      })
    );
  });

  it('should return 400 if ID or quantity is missing', async () => {
    const res = await request(app).post('/api/sweets/restock').send({ id: 2001 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 404 if sweet with given ID does not exist', async () => {
    const res = await request(app).post('/api/sweets/restock').send({
      id: 9999,
      quantity: 10,
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Sweet not found');
  });

  it('should return 400 for invalid quantity (negative)', async () => {
    const res = await request(app).post('/api/sweets/restock').send({
      id: 2001,
      quantity: -5,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Quantity must be a positive number');
  });
});
