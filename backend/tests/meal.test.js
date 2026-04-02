const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Food = require('../models/Food');
const Meal = require('../models/Meal');

const testApp = express();
testApp.use(express.json());
testApp.use('/api/meals', require('../routes/mealRoutes'));

describe('Meal API Tests', () => {
  let authToken;
  let testUser;
  let testFood;

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
    await Meal.deleteMany({});
    
    // Create test user
    testUser = await User.create({
      name: 'Meal Tester',
      email: 'mealtester@example.com',
      password: 'password123'
    });
    
    // Generate token
    authToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Create test food
    testFood = await Food.create({
      name: 'Test Food',
      calories: 100,
      protein: 10,
      carbs: 20,
      fat: 5,
      category: 'other'
    });
  });

  afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log('Test DB connection closed');
  });

  describe('POST /api/meals', () => {
    it('should add food to meal', async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const res = await request(testApp)
        .post('/api/meals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          date: today,
          category: 'lunch',
          foodId: testFood._id,
          quantity: 150
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('items');
      expect(res.body.items.length).toBe(1);
    });
  });

  describe('GET /api/meals/summary', () => {
    it('should return daily summary', async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // First add a meal
      await request(testApp)
        .post('/api/meals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          date: today,
          category: 'lunch',
          foodId: testFood._id,
          quantity: 150
        });
      
      const res = await request(testApp)
        .get(`/api/meals/summary?date=${today}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalCalories');
    });
  });
});