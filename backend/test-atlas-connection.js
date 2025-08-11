// test-atlas-connection.js
const mongoose = require('mongoose');
require('dotenv').config();

async function testAtlasConnection() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log('URI:', process.env.MONGODB_URI.replace(/:([^:@]{8})[^:@]*@/, ':****@')); // Hide password
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas connection successful!');
    
    // Test database operations
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Database write test successful!');
    
    const count = await testCollection.countDocuments();
    console.log(`✅ Database read test successful! Documents: ${count}`);
    
    // Clean up test data
    await testCollection.deleteMany({ test: true });
    console.log('✅ Database cleanup successful!');
    
    console.log('🎉 MongoDB Atlas is ready for your dating app!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('💡 Check your username and password in the connection string');
    }
    if (error.message.includes('IP not authorized')) {
      console.log('💡 Make sure your IP address is whitelisted in Network Access');
    }
    
    process.exit(1);
  }
}

testAtlasConnection();