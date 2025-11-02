const mongoose = require('mongoose');
const { connectDB, closeDB } = require('../src/config/database');
const Review = require('../src/models/Review');
const logger = require('../src/utils/logger');
require('dotenv').config();

const seedData = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    rating: 5,
    comment: 'Absolutely fantastic work! K.K.M.A. Homestyler transformed our living space beyond our expectations. Professional, timely, and creative.',
    approved: true,
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    rating: 5,
    comment: 'Excellent design service and attention to detail. They understood our vision perfectly and delivered amazing results within budget.',
    approved: true,
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    rating: 5,
    comment: 'Professional team with great design sense. Our home looks beautiful now. Highly recommend their services!',
    approved: true,
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0) AppleWebKit/605.1.15'
  }
];

const migrate = async () => {
  try {
    console.log('🚀 Starting MongoDB migration...');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if reviews already exist
    const existingReviews = await Review.countDocuments();
    if (existingReviews > 0) {
      console.log(`⚠️  Found ${existingReviews} existing reviews. Skipping seed data insertion.`);
    } else {
      // Insert seed data
      console.log('📝 Inserting sample reviews...');
      const insertedReviews = await Review.insertMany(seedData);
      console.log(`✅ Successfully inserted ${insertedReviews.length} sample reviews`);

      // Log inserted reviews
      insertedReviews.forEach((review, index) => {
        console.log(`   ${index + 1}. ${review.name} - Rating: ${review.rating}/5`);
      });
    }

    // Create indexes (they're already defined in the schema, but let's ensure they're created)
    console.log('🔧 Ensuring indexes are created...');
    await Review.createIndexes();
    console.log('✅ Database indexes created');

    // Test aggregation pipeline
    console.log('📊 Testing statistics aggregation...');
    const stats = await Review.getStatistics();
    console.log('✅ Statistics aggregation working:');
    console.log(`   Total Reviews: ${stats.totalReviews}`);
    console.log(`   Average Rating: ${stats.averageRating}`);
    console.log(`   Rating Distribution:`, stats.ratingDistribution);

    console.log('\n🎉 MongoDB migration completed successfully!');
    console.log(`📍 Database: ${process.env.MONGODB_URI}`);
    console.log('🚀 Ready to start the application!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    logger.error('MongoDB migration error:', error);
    process.exit(1);
  } finally {
    await closeDB();
    console.log('🔌 Database connection closed');
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Run migration
if (require.main === module) {
  migrate();
}

module.exports = { migrate, seedData };