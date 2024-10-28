import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js'; // adjust path to your app module


describe('GET /api/v1/job', () => {
  it('should return 200 and the resource when user is authenticated', async () => {
    const response = await request(app)
      .get('/api/v1/job')
      .set('Authorization', 'Bearer valid_token'); // Mock valid token

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('data', 'Secure Resource');
  });

  it('should return 401 when user is not authenticated', async () => {
    const response = await request(app).get('/api/v1/job');

    expect(response.status).to.equal(401);
    expect(response.text).to.equal('Unauthorized');
  });

  it('should return 401 for invalid token', async () => {
    const response = await request(app)
      .get('/api/v1/job')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).to.equal(401);
    expect(response.text).to.equal('Unauthorized');
  });
});
