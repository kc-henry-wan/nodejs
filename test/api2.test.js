// tests/api.test.js
const sinon = require('sinon');
const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

// Mock user authentication
describe('GET /api/v1/job with mock', () => {
  let authStub;

  beforeEach(() => {
    // Stub the req.user property for valid and invalid scenarios
    authStub = sinon.stub();
  });

  afterEach(() => {
    authStub.restore();
  });

  it('should return 200 when user is authenticated', async () => {
    authStub.callsFake((req, res, next) => {
      req.user = { id: 1 }; // Simulate authenticated user
      next();
    });

    app.use((req, res, next) => authStub(req, res, next));

    const response = await request(app).get('/api/resource');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('data', 'Secure Resource');
  });

  it('should return 401 when user is not authenticated', async () => {
    authStub.callsFake((req, res, next) => {
      delete req.user; // Simulate unauthenticated user
      next();
    });

    app.use((req, res, next) => authStub(req, res, next));

    const response = await request(app).get('/api/resource');
    expect(response.status).to.equal(401);
    expect(response.text).to.equal('Unauthorized');
  });
});
