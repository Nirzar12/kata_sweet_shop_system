const request = require('supertest');
const Sweet = require('../models/sweet');
const app = require('../app');

describe('Delete Sweets API', () => {
  it('should delete a sweet by ID', async () => {
    // Insert one sweet to delete
    await Sweet.create({
      id: 9999,
      name: 'Test Sweet',
      category: 'Sugar-Based',
      price: 10,
      quantity: 5,
    });

    const res = await request(app).delete('/api/sweets/9999');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: 'Sweet with ID 9999 deleted successfully'
    });

    const sweet = await Sweet.findOne({ id: 9999 });
    expect(sweet).toBeNull();
  });

  it('should return 404 if sweet not found', async () => {
    const res = await request(app).delete('/api/sweets/9999'); // Nothing inserted

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Sweet with ID 9999 not found');
  });

  it('should delete all sweets', async () => {
    await Sweet.insertMany([
      { id: 1, name: 'Sweet 1', category: 'Milk-Based', price: 10, quantity: 5 },
      { id: 2, name: 'Sweet 2', category: 'Nut-Based', price: 20, quantity: 10 },
    ]);

    const res = await request(app).delete('/api/sweets');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'All sweets deleted successfully' });

    const sweets = await Sweet.find();
    expect(sweets.length).toBe(0);
  });
});
