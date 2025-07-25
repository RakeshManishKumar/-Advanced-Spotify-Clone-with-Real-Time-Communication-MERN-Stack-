#!/usr/bin/env node

import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    const response = await axios.get(`${API_BASE}/auth/test`);
    console.log('✅ Database connection successful:', response.data);
  } catch (error) {
    console.error('❌ Database connection failed:', error.response?.data || error.message);
  }
}

async function testAuthEndpoint() {
  try {
    console.log('\n🔍 Testing auth endpoint...');
    const testUser = {
      id: 'test_user_123',
      firstName: 'Test',
      lastName: 'User',
      imageUrl: 'https://example.com/avatar.jpg'
    };
    
    const response = await axios.post(`${API_BASE}/auth/sync-user`, testUser);
    console.log('✅ Auth endpoint working:', response.data);
  } catch (error) {
    console.error('❌ Auth endpoint failed:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting authentication debug tests...\n');
  
  await testDatabaseConnection();
  await testAuthEndpoint();
  
  console.log('\n📝 Next steps:');
  console.log('1. Check if MongoDB is running');
  console.log('2. Verify your .env file has MONGODB_URI');
  console.log('3. Try signing in through the frontend');
  console.log('4. Check browser console for any errors');
  console.log('5. Check backend console for request logs');
}

runTests().catch(console.error); 