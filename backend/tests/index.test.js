const request = require('supertest');
const app = require('../app');

describe('Server Root Endpoint', () => {
  /**
   * ✅ Test: GET / should return welcome message
   */
  it('should return greeting message on GET /', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Sweet shop is up and running...');
  });
});
