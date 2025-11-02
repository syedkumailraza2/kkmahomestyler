const mongoose = require('mongoose');
const logger = require('../utils/logger');

// MongoDB connection options
const connectOptions = {
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE) || 10,
  serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT) || 5000,
  socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT) || 45000,
  bufferCommands: false
};

const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'test'
      ? process.env.MONGODB_TEST_URI
      : process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI, connectOptions);
    logger.info('Connected to MongoDB database');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    return mongoose.connection;
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = { connectDB, closeDB, mongoose };