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

  // Backup existing sweets if any
  originalData = await Sweet.find().lean();
});

beforeEach(async () => {
  await Sweet.deleteMany(); // Clear all sweets before each test
});

describe('View Sweets API', () => {
  it('should return all sweets from the database', async () => {
    const sampleSweets = [
      {
        id: 2001,
        name: 'Kaju Katli',
        category: 'Nut-Based',
        price: 50,
        quantity: 20
      },
      {
        id: 2002,
        name: 'Gulab Jamun',
        category: 'Milk-Based',
        price: 15,
        quantity: 50
      }
    ];

    await Sweet.insertMany(sampleSweets);

    const res = await request(app).get('/api/sweets');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);

    const ids = res.body.map(s => s.id);
    expect(ids).toEqual(expect.arrayContaining([2001, 2002]));
  });

  it('should return an empty array if no sweets are present', async () => {
    const res = await request(app).get('/api/sweets');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]); // No sweets
  });
});

afterAll(async () => {
  await Sweet.deleteMany();
  if (originalData.length > 0) {
    await Sweet.insertMany(originalData);
  }

  await mongoose.connection.close();
});
