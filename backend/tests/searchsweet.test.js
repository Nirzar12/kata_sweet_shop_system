const request = require('supertest');
const Sweet = require('../models/sweet');
const app = require('../app');

describe('Search Sweets API', () => {
  /**
   * Seed the DB with some sample sweets before each test
   */
  beforeEach(async () => {
    await Sweet.deleteMany(); // Clear old data
    await Sweet.insertMany([
      { id: 1, name: 'Rasgulla', category: 'Milk-Based', price: 20, quantity: 25 },
      { id: 2, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 15 },
      { id: 3, name: 'Gulab Jamun', category: 'Milk-Based', price: 30, quantity: 10 },
      { id: 4, name: 'Fruit Tart', category: 'Fruit-Based', price: 60, quantity: 8 },
    ]);
  });

  /**
   * 🔍 Test: Search by name (partial, case-insensitive)
   */
  it('should search sweets by name (partial match)', async () => {
    const res = await request(app).get('/api/sweets/search?name=ras');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Rasgulla');
  });

  /**
   * 🔍 Test: Search by category
   */
  it('should search sweets by category', async () => {
    const res = await request(app).get('/api/sweets/search?category=Milk-Based');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    const categories = res.body.map(s => s.category);
    expect(categories.every(cat => cat === 'Milk-Based')).toBe(true);
  });

  /**
   * 🔍 Test: Search by price range
   */
  it('should search sweets by price range', async () => {
    const res = await request(app).get('/api/sweets/search?priceMin=25&priceMax=55');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    const prices = res.body.map(s => s.price);
    expect(prices.every(price => price >= 25 && price <= 55)).toBe(true);
  });

  /**
   * 🔍 Test: Combined search (category + price)
   */
  it('should combine multiple search criteria', async () => {
    const res = await request(app).get('/api/sweets/search?category=Milk-Based&priceMax=25');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Rasgulla');
  });

  /**
   * ✅ Test: No filters — should return all sweets
   */
  it('should return all sweets when no search criteria provided', async () => {
    const res = await request(app).get('/api/sweets/search');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(4);
  });
  /**
   * ❌ Test: Invalid priceMin value (non-numeric)
   */
  it('should return 400 for non-numeric priceMin', async () => {
    const res = await request(app).get('/api/sweets/search?priceMin=abc');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'priceMin must be a number');
  });

  /**
   * ✅ Test: Non-existent category returns empty array
   */
  it('should return empty list for non-existent category', async () => {
    const res = await request(app).get('/api/sweets/search?category=Non-Existing');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});
