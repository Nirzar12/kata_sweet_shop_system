const request = require('supertest');
const app = require('../index'); // path to your server.js

describe('Server Test', () => {
  it('should return greeting message on GET /', async () => {
    const res = await request(app).get('/');
    
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Sweet shop is up and running...');
  });
});
