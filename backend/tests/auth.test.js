const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('../models/User');

dotenv.config();

// Create test app
const testApp = express();
testApp.use(cors());
testApp.use(express.json());
testApp.use('/api/auth', require('../routes/authRoutes'));

describe('Authentication API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    const testDB = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/diet-tracker-test';
    await mongoose.connect(testDB);
    console.log('Test DB connected');
  });

  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log('Test DB connection closed');
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(testApp)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.name).toBe('Test User');
    });

    it('should not register a user with existing email', async () => {
      // First create a user
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123'
      });

      const res = await request(testApp)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      // First create a user
      const user = await User.create({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123'
      });

      const res = await request(testApp)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.name).toBe('Login User');
    });

    it('should not login with wrong password', async () => {
      // First create a user
      await User.create({
        name: 'Wrong Password User',
        email: 'wrong@example.com',
        password: 'password123'
      });

      const res = await request(testApp)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });
});