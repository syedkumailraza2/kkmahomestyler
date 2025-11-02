# K.K.M.A. Homestyler API

Professional REST API for the K.K.M.A. Homestyler rating and review system.

## Features

- ✅ Industry-grade Node.js/Express.js architecture
- ✅ MongoDB with Mongoose ODM
- ✅ Comprehensive input validation with Joi
- ✅ Professional error handling and logging
- ✅ Rate limiting and security middleware
- ✅ RESTful API design with proper HTTP methods
- ✅ Database indexing for optimal performance
- ✅ CORS enabled for frontend integration
- ✅ Comprehensive logging with Winston
- ✅ Review approval system
- ✅ Aggregation pipeline for statistics

## Technology Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston with daily rotation
- **Testing**: Jest (configured)

## Project Structure

```
backend/
├── src/
│   ├── app.js                 # Main application entry point
│   ├── config/
│   │   └── database.js        # Database configuration
│   ├── controllers/
│   │   └── reviewController.js # Review logic handlers
│   ├── middleware/
│   │   ├── errorHandler.js    # Global error handler
│   │   └── notFound.js        # 404 handler
│   ├── models/
│   │   └── Review.js           # Review data model
│   ├── routes/
│   │   └── reviewRoutes.js     # Review API routes
│   ├── utils/
│   │   ├── AppError.js         # Custom error class
│   │   └── logger.js           # Logging configuration
│   └── validations/
│       └── reviewValidation.js # Input validation schemas
├── scripts/
│   ├── migrate.js             # Database migration script
│   └── seed.js                # Seed data script
├── tests/
│   ├── unit/                  # Unit tests
│   └── integration/           # Integration tests
├── docs/                      # Documentation
├── logs/                      # Log files
├── package.json               # Dependencies and scripts
├── .env.example              # Environment variables template
└── README.md                  # This file
```

## API Endpoints

### Reviews

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/api/v1/reviews` | Create a new review | None |
| `GET` | `/api/v1/reviews` | Get all reviews with pagination | None |
| `GET` | `/api/v1/reviews/:id` | Get review by ID | None |
| `GET` | `/api/v1/reviews/statistics` | Get rating statistics | None |
| `DELETE` | `/api/v1/reviews/:id` | Delete review by ID | Admin |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | API health check |
| `GET` | `/health` | Server uptime check |

## Prerequisites

- Node.js (>= 16.0.0)
- npm (>= 8.0.0)
- MongoDB (>= 4.4)
- Git

## Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Ensure MongoDB is running**
   ```bash
   # Start MongoDB service
   sudo systemctl start mongod

   # Or if using MongoDB Atlas, update MONGODB_URI in .env
   ```

4. **Run database migration**
   ```bash
   npm run migrate
   ```
   This will:
   - Connect to MongoDB
   - Create necessary indexes
   - Insert sample review data
   - Test the aggregation pipeline

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Start production server**
   ```bash
   npm start
   ```

## Environment Variables

```env
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/kkma_homestyler
MONGODB_TEST_URI=mongodb://localhost:27017/kkma_homestyler_test

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE_IN=90d
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## API Usage Examples

### Create a Review

```javascript
const reviewData = {
  name: "John Doe",
  email: "john@example.com",
  rating: 5,
  comment: "Excellent service!"
};

const response = await fetch('/api/v1/reviews', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(reviewData)
});

const result = await response.json();
```

### Get Reviews with Pagination

```javascript
const response = await fetch('/api/v1/reviews?page=1&limit=10&sortBy=created_at&sortOrder=DESC');
const result = await response.json();
```

### Get Rating Statistics

```javascript
const response = await fetch('/api/v1/reviews/statistics');
const stats = await response.json();
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "rating": 5,
    "comment": "Excellent service!",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## Validation Rules

### Create Review
- **name**: 2-50 characters, letters/spaces/hyphens/apostrophes only
- **email**: Valid email format, max 100 characters, unique
- **rating**: Integer between 1 and 5
- **comment**: Optional, max 1000 characters

## Security Features

- ✅ Input validation and sanitization
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS configuration
- ✅ MongoDB injection protection via Mongoose
- ✅ XSS protection
- ✅ Security headers (Helmet)
- ✅ Request logging
- ✅ Email verification to prevent duplicate reviews

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Lint code
npm run lint
```

## Logging

- **Development**: Console output with colors
- **Production**: File-based logging with daily rotation
- **Log Levels**: Error, Warning, Info, Debug
- **Log Files**: `error-YYYY-MM-DD.log`, `combined-YYYY-MM-DD.log`

## Database Schema

### Review Model

```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  rating: Number (required, 1-5, integer),
  comment: String (optional, max 1000 chars),
  approved: Boolean (default: false),
  ipAddress: String,
  userAgent: String,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes

- `email` - Unique index for email lookup
- `createdAt` - For sorting by date
- `approved` - For filtering approved reviews
- `rating` - For rating-based queries

### Aggregation Pipeline

The statistics are calculated using MongoDB's aggregation pipeline:

```javascript
[
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
]
```

## Deployment

### Environment Variables for Production
- `NODE_ENV=production`
- `PORT=5000`
- `FRONTEND_URL=https://yourdomain.com`
- `LOG_LEVEL=warn`

### Process Manager (PM2)
```bash
npm install -g pm2
pm2 start src/app.js --name "kkma-api"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests and ensure they pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, please contact K.K.M.A. Homestyler or create an issue in the repository.