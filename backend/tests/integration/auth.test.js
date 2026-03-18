import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import authRoutes from '../../routes/authRoutes.js';
import User from '../../models/User.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API Integration Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    process.env.JWT_SECRET = 'test_secret';
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user successfully (POST /api/auth/register)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Test User');
    expect(res.body.email).toBe('test@example.com');
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user (POST /api/auth/login)', async () => {
    // First setup the user
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Login User');
    expect(res.body).toHaveProperty('token');
  });
});
