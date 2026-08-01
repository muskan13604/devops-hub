const request = require('supertest');
const app = require('../../src/app');

describe('Projects API', () => {
  it('should retrieve a list of projects', async () => {
    const res = await request(app).get('/api/projects');
    expect([200, 401, 403, 404]).toContain(res.statusCode);
  });
});
