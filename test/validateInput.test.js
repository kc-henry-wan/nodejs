const { expect } = require('chai');
const validateEmail = require('../src/validation/validateInput');

describe('validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('test@example.com')).to.be.true;
  });

  it('should return false for invalid email', () => {
    expect(validateEmail('invalid-email')).to.be.false;
  });
});
