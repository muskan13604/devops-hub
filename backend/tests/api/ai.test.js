const request = require('supertest');
const app = require('../../src/app');

describe('AI API', () => {
  it('should return error if GEMINI key is missing or invalid prompt', async () => {
    const res = await request(app)
      .post('/api/ai/generate-yaml')
      .send({ prompt: 'Create deployment' });
      
    expect([400, 401, 404, 500]).toContain(res.statusCode);
  });
});
