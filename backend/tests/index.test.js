const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Server Test', () => {

  it('should return greeting message on GET /', async () => {
    const res = await request(app).get('/');
    
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Sweet shop is up and running...');
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
