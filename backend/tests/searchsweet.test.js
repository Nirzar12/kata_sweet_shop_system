const request = require('supertest');
const mongoose = require('mongoose');
const Sweet = require('../models/sweet');
const app = require('../app');

let originalData = [];

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/sweetshop_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  originalData = await Sweet.find().lean();
});

beforeEach(async () => {
  await Sweet.deleteMany();

  await Sweet.insertMany([
    { id: 1, name: 'Rasgulla', category: 'Milk-Based', price: 20, quantity: 25 },
    { id: 2, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 15 },
    { id: 3, name: 'Gulab Jamun', category: 'Milk-Based', price: 30, quantity: 10 },
    { id: 4, name: 'Fruit Tart', category: 'Fruit-Based', price: 60, quantity: 8 },
  ]);
});

describe('Search & Filter Sweets', () => {
  it('should search sweets by partial name (case-insensitive)', async () => {
    const res = await request(app).get('/api/sweets/search?name=ras');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Rasgulla');
  });

  it('should filter sweets by category', async () => {
    const res = await request(app).get('/api/sweets/search?category=Milk-Based');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    const categories = res.body.map(s => s.category);
    expect(categories.every(c => c === 'Milk-Based')).toBe(true);
  });

  it('should filter sweets by price range', async () => {
    const res = await request(app).get('/api/sweets/search?priceMin=25&priceMax=55');
    expect(res.statusCode).toBe(200);
    const prices = res.body.map(s => s.price);
    expect(prices.every(p => p >= 25 && p <= 55)).toBe(true);
  });

  it('should combine multiple filters', async () => {
    const res = await request(app).get('/api/sweets/search?name=gulab&category=Milk-Based&priceMax=40');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Gulab Jamun');
  });
});

afterAll(async () => {
  await Sweet.deleteMany();
  if (originalData.length > 0) {
    await Sweet.insertMany(originalData);
  }
  await mongoose.connection.close();
});
