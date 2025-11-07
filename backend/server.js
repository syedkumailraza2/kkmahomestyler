require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');

// Import Review model
const Review = require('./models/Review');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/..'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kkma_homestyler', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ Connected to MongoDB successfully');

    // Initialize with sample data if no reviews exist
    //initializeSampleData();
})
.catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    console.log('⚠️  Make sure MongoDB is running and MONGODB_URI is correct');
});

// Function to initialize sample data
async function initializeSampleData() {
    try {
        const existingReviews = await Review.countDocuments();

        if (existingReviews === 0) {
            const sampleReviews = [
                {
                    name: "Sarah Johnson",
                    email: "sarah@example.com",
                    rating: 5,
                    comment: "Excellent interior design service! Very professional and creative team."
                },
                {
                    name: "Michael Chen",
                    email: "michael@example.com",
                    rating: 4,
                    comment: "Great experience working with KKMA. They transformed our living room beautifully."
                },
                {
                    name: "Emily Rodriguez",
                    email: "emily@example.com",
                    rating: 5,
                    comment: "Amazing attention to detail and very responsive to our needs. Highly recommend!"
                }
            ];

            await Review.insertMany(sampleReviews);
            console.log('📝 Sample reviews initialized');
        }
    } catch (error) {
        console.error('Error initializing sample data:', error);
    }
}

// API Routes

// GET /api/reviews - Get all reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ isApproved: true })
            .sort({ date: -1 }) // Sort by newest first
            .lean(); // Convert to plain JavaScript objects

        // Format the response to match frontend expectations
        const formattedReviews = reviews.map(review => ({
            id: review._id,
            name: review.name,
            email: review.email,
            rating: review.rating,
            comment: review.comment,
            date: review.date.toISOString()
        }));

        res.json(formattedReviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// POST /api/reviews - Create a new review
app.post('/api/reviews', async (req, res) => {
    try {
        const { name, email, rating, comment } = req.body;

        // Validation
        if (!name || !email || !rating) {
            return res.status(400).json({ error: 'Name, email, and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check if email already has a review (optional - uncomment if you want to prevent duplicate reviews)
        // const existingReview = await Review.findOne({ email: email.toLowerCase() });
        // if (existingReview) {
        //     return res.status(400).json({ error: 'You have already submitted a review with this email' });
        // }

        // Create new review
        const newReview = new Review({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            rating: parseInt(rating),
            comment: comment ? comment.trim() : ''
        });

        // Save to database
        const savedReview = await newReview.save();

        console.log('📝 New review added:', savedReview);

        // Format response to match frontend expectations
        const responseReview = {
            id: savedReview._id,
            name: savedReview.name,
            email: savedReview.email,
            rating: savedReview.rating,
            comment: savedReview.comment,
            date: savedReview.date.toISOString()
        };

        res.status(201).json({
            message: 'Review submitted successfully!',
            review: responseReview
        });

    } catch (error) {
        console.error('Error submitting review:', error);

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: errors.join(', ') });
        }

        res.status(500).json({ error: 'Failed to submit review' });
    }
});

// GET /api/rating - Get rating statistics
app.get('/api/rating', async (req, res) => {
    try {
        const stats = await Review.getRatingStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching rating statistics:', error);
        res.status(500).json({ error: 'Failed to fetch rating statistics' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'KKMA Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend files (optional - if you want to serve both from same server)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 KKMA Backend server running on port ${PORT}`);
    console.log(`📊 API endpoints available:`);
    console.log(`   GET  /api/reviews - Get all reviews`);
    console.log(`   POST /api/reviews - Create new review`);
    console.log(`   GET  /api/rating - Get rating statistics`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`🌐 Server ready at: http://localhost:${PORT}`);
});