const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Food = require('../models/Food');

dotenv.config();

const testApp = express();
testApp.use(express.json());
testApp.use('/api/foods', require('../routes/foodRoutes'));

describe('Food API Tests', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Connect to test database
    const testDB = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/diet-tracker-test';
    await mongoose.connect(testDB);
    console.log('Test DB connected');
  });

  beforeEach(async () => {
    // Clear data before each test
    await User.deleteMany({});
    await Food.deleteMany({});
    
    // Create test user
    testUser = await User.create({
      name: 'Food Tester',
      email: 'foodtester@example.com',
      password: 'password123'
    });
    
    // Generate token
    authToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Add test foods
    await Food.create([
      { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, category: 'fruits' },
      { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, category: 'fruits' },
      { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'meats' }
    ]);
  });

  afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log('Test DB connection closed');
  });

  describe('GET /api/foods/search', () => {
    it('should search foods by name', async () => {
      const res = await request(testApp)
        .get('/api/foods/search?q=apple')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].name).toBe('Apple');
    });

    it('should return empty array for no matches', async () => {
      const res = await request(testApp)
        .get('/api/foods/search?q=xyz123')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /api/foods/debug/count', () => {
    it('should return food count', async () => {
      const res = await request(testApp)
        .get('/api/foods/debug/count')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body.total).toBeGreaterThan(0);
    });
  });
});