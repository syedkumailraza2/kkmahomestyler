const Review = require('../models/Review');
const logger = require('../utils/logger');
const { AppError } = require('../utils/AppError');

const createReview = async (req, res, next) => {
  try {
    const { name, email, rating, comment, ipAddress, userAgent } = req.validatedBody;

    // Check if email already exists
    const emailExists = await Review.findByEmail(email);
    if (emailExists) {
      return next(new AppError('A review with this email address already exists', 400));
    }

    // Create review
    const review = await Review.create({
      name,
      email,
      rating,
      comment,
      ipAddress,
      userAgent
    });

    logger.info(`New review created: ${email} - Rating: ${rating}`);

    res.status(201).json({
      status: 'success',
      message: 'Review submitted successfully. It will be visible after approval.',
      data: {
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt
      }
    });
  } catch (error) {
    logger.error('Error creating review:', error);
    next(new AppError('Failed to submit review', 500));
  }
};

const getReviews = async (req, res, next) => {
  try {
    const { page, limit, sortBy, sortOrder } = req.validatedQuery;

    const reviews = await Review.findApproved({
      page,
      limit,
      sortBy,
      sortOrder
    });

    // Get total count for pagination
    const totalCount = await Review.countApproved();
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      pagination: {
        currentPage: page,
        totalPages,
        limit,
        totalReviews: totalCount
      },
      data: reviews.map(review => review.getFormattedReview())
    });
  } catch (error) {
    logger.error('Error fetching reviews:', error);
    next(new AppError('Failed to fetch reviews', 500));
  }
};

const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: review.getFormattedReview()
    });
  } catch (error) {
    logger.error('Error fetching review by ID:', error);
    next(new AppError('Failed to fetch review', 500));
  }
};

const getStatistics = async (req, res, next) => {
  try {
    const stats = await Review.getStatistics();

    res.status(200).json({
      status: 'success',
      data: {
        totalReviews: stats.totalReviews,
        averageRating: parseFloat(stats.averageRating),
        ratingDistribution: stats.ratingDistribution
      }
    });
  } catch (error) {
    logger.error('Error fetching statistics:', error);
    next(new AppError('Failed to fetch statistics', 500));
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    logger.info(`Review deleted: ID ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting review:', error);
    next(new AppError('Failed to delete review', 500));
  }
};

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  getStatistics,
  deleteReview
};