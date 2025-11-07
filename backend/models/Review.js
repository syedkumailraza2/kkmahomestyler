const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address'
        ]
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    comment: {
        type: String,
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    date: {
        type: Date,
        default: Date.now
    },
    isApproved: {
        type: Boolean,
        default: true // Auto-approve reviews for simplicity
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for faster queries
ReviewSchema.index({ date: -1 });
ReviewSchema.index({ email: 1 });
ReviewSchema.index({ rating: 1 });

// Virtual for formatted date
ReviewSchema.virtual('formattedDate').get(function() {
    return this.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Static method to get rating statistics
ReviewSchema.statics.getRatingStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                averageRating: { $avg: '$rating' },
                ratingDistribution: {
                    $push: '$rating'
                }
            }
        }
    ]);

    if (stats.length === 0) {
        return {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
    }

    const result = stats[0];
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    result.ratingDistribution.forEach(rating => {
        if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating]++;
        }
    });

    return {
        averageRating: Math.round(result.averageRating * 10) / 10,
        totalReviews: result.totalReviews,
        ratingDistribution
    };
};

// Pre-save middleware to ensure email is lowercase
ReviewSchema.pre('save', function(next) {
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    next();
});

module.exports = mongoose.model('Review', ReviewSchema);