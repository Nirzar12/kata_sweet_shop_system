const request = require('supertest');
const Sweet = require('../models/sweet');
const app = require('../app');

describe('Purchase Sweet API', () => {
  beforeEach(async () => {
    // Add a sweet for testing
    await Sweet.create({
      id: 2001,
      name: 'Kaju Katli',
      category: 'Dry Fruit',
      price: 30,
      quantity: 20,
    });
  });

  it('should purchase sweet and decrease quantity', async () => {
    const res = await request(app)
      .post('/api/sweets/purchase')
      .send({ id: 2001, quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Purchase successful',
        remainingQuantity: 15,
      })
    );

    const updatedSweet = await Sweet.findOne({ id: 2001 });
    expect(updatedSweet.quantity).toBe(15);
  });

  it('should return error if not enough stock', async () => {
    const res = await request(app)
      .post('/api/sweets/purchase')
      .send({ id: 2001, quantity: 50 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Not enough stock available');
  });

  it('should return error if sweet does not exist', async () => {
    const res = await request(app)
      .post('/api/sweets/purchase')
      .send({ id: 9999, quantity: 1 });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Sweet not found');
  });

  it('should return 400 if purchase quantity is not provided', async () => {
    const res = await request(app)
      .post('/api/sweets/purchase')
      .send({ id: 2001 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
