import jwt from 'jsonwebtoken';
import generateToken from '../../utils/generateToken.js';

describe('Generate Token Utility', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
  });

  it('should generate a valid JWT token', () => {
    const mockRes = {
      cookie: jest.fn(),
    };
    const userId = '507f1f77bcf86cd799439011';
    
    const token = generateToken(mockRes, userId);
    
    expect(token).toBeDefined();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.userId).toBe(userId);
  });
});
