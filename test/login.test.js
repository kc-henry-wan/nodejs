// tests/login.test.js
const { expect } = require('chai');
const login = require('../src/services/loginService');

describe('Login Function', () => {
  it('should successfully log in with valid credentials', async () => {
    const result = await login('test@example.com', 'password123');
    expect(result).to.have.property('token');
  });

  it('should fail login with invalid credentials', async () => {
    try {
      await login('test@example.com', 'wrongpassword');
    } catch (error) {
      expect(error.message).to.equal('Invalid credentials');
    }
  });
});
