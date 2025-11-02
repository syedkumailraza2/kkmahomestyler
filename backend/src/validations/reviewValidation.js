const Joi = require('joi');

const createReviewSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .email()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email cannot exceed 100 characters',
      'any.required': 'Email is required'
    }),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be a whole number',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5',
      'any.required': 'Rating is required'
    }),

  comment: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Comment cannot exceed 1000 characters'
    })
});

const getReviewsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be a whole number',
      'number.min': 'Page must be at least 1'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be a whole number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),

  sortBy: Joi.string()
    .valid('created_at', 'rating', 'name')
    .default('created_at')
    .messages({
      'any.only': 'Sort field must be one of: created_at, rating, name'
    }),

  sortOrder: Joi.string()
    .valid('ASC', 'DESC')
    .default('DESC')
    .messages({
      'any.only': 'Sort order must be either ASC or DESC'
    })
});

const validateCreateReview = (req, res, next) => {
  const { error, value } = createReviewSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // Add additional data
  req.body.ipAddress = req.ip || req.connection.remoteAddress;
  req.body.userAgent = req.get('User-Agent') || 'Unknown';

  req.validatedBody = value;
  next();
};

const validateGetReviews = (req, res, next) => {
  const { error, value } = getReviewsSchema.validate(req.query);

  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid query parameters',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  req.validatedQuery = value;
  next();
};

const validateReviewId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'Valid review ID is required'
    });
  }

  req.params.id = parseInt(id);
  next();
};

module.exports = {
  validateCreateReview,
  validateGetReviews,
  validateReviewId,
  createReviewSchema,
  getReviewsSchema
};