const request = require('supertest');
const Sweet = require('../models/sweet');
const app = require('../app');

describe('View Sweets API', () => {

  // Clear DB before each test to isolate test cases
  beforeEach(async () => {
    await Sweet.deleteMany({});
  });

  /**
   * ✅ Test: Should return all sweets from the database
   */
  it('should return all sweets from the database', async () => {
    const sampleSweets = [
      {
        id: 2001,
        name: 'Kaju Katli',
        category: 'Nut-Based',
        price: 50,
        quantity: 20,
      },
      {
        id: 2002,
        name: 'Gulab Jamun',
        category: 'Milk-Based',
        price: 15,
        quantity: 50,
      },
    ];

    await Sweet.insertMany(sampleSweets); // Seed DB with test data

    const res = await request(app).get('/api/sweets');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);

    const ids = res.body.map(s => s.id);
    expect(ids).toEqual(expect.arrayContaining([2001, 2002]));
  });

  /**
   * ✅ Test: Should return an empty array when no sweets exist
   */
  it('should return an empty array if no sweets are present', async () => {
    const res = await request(app).get('/api/sweets');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]); // Empty result expected
  });
});
