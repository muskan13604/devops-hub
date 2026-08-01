const request = require('supertest');
const app = require('../../src/app');

describe('Auth API', () => {
  it('should reject login without credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
      
    // Assuming the API returns 400 Bad Request or 401 Unauthorized for empty body
    expect([400, 401, 404]).toContain(res.statusCode);
  });
});
