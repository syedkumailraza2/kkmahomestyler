const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    match: [/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    maxlength: [100, 'Email cannot exceed 100 characters'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    unique: true
  },

  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    integer: true
  },

  comment: {
    type: String,
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    default: ''
  },

  approved: {
    type: Boolean,
    default: false
  },

  ipAddress: {
    type: String,
    required: false
  },

  userAgent: {
    type: String,
    required: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true, transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }}
});

// Indexes for better performance
reviewSchema.index({ email: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ approved: 1 });
reviewSchema.index({ rating: 1 });

// Virtual for formatted date
reviewSchema.virtual('createdAtFormatted').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Static methods
reviewSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

reviewSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $match: { approved: true }
    },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        rating1Count: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        rating2Count: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
        rating3Count: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
        rating4Count: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
        rating5Count: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const result = stats[0];
  return {
    totalReviews: result.totalReviews,
    averageRating: parseFloat(result.averageRating || 0).toFixed(1),
    ratingDistribution: {
      1: result.rating1Count,
      2: result.rating2Count,
      3: result.rating3Count,
      4: result.rating4Count,
      5: result.rating5Count
    }
  };
};

reviewSchema.statics.findApproved = function(options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const validSortFields = ['createdAt', 'rating', 'name'];
  const validSortOrders = ['asc', 'desc'];

  const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const safeSortOrder = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder : 'desc';

  return this.find({ approved: true })
    .sort({ [safeSortBy]: safeSortOrder })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

reviewSchema.statics.countApproved = function() {
  return this.countDocuments({ approved: true });
};

// Instance methods
reviewSchema.methods.getFormattedReview = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    rating: this.rating,
    comment: this.comment,
    approved: this.approved,
    createdAt: this.createdAt,
    createdAtFormatted: this.createdAtFormatted
  };
};

// Pre-save middleware
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Post-save middleware
reviewSchema.post('save', function(doc) {
  // Log when a new review is created
  if (doc.isNew) {
    console.log(`New review created: ${doc.email} - Rating: ${doc.rating}`);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;