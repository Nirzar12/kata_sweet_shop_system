const request = require('supertest');
const Sweet = require('../models/sweet');
const app = require('../app');

describe('Delete Sweets API', () => {

  // Clean DB before each test
  beforeEach(async () => {
    await Sweet.deleteMany({});
  });

  /**
   * ✅ Test: Delete sweet by ID
   */
  it('should delete a sweet by ID', async () => {
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
      message: 'Sweet with ID 9999 deleted successfully',
    });

    const sweet = await Sweet.findOne({ id: 9999 });
    expect(sweet).toBeNull();
  });

  /**
   * ❌ Test: Delete non-existing sweet
   */
  it('should return 404 if sweet not found', async () => {
    const res = await request(app).delete('/api/sweets/9999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Sweet with ID 9999 not found');
  });

  /**
   * ✅ Test: Delete all sweets
   */
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

  /**
   * ❌ Test: Delete from empty database
   */
  it('should return 200 even if no sweets exist when deleting all', async () => {
    const res = await request(app).delete('/api/sweets');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'All sweets deleted successfully' });

    const sweets = await Sweet.find();
    expect(sweets.length).toBe(0);
  });

  /**
   * ❌ Test: Invalid ID format (non-numeric)
   */
  it('should return 400 if ID is not a valid number', async () => {
    const res = await request(app).delete('/api/sweets/abc'); // Invalid ID format

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid ID format');
  });

});
