# KKMA HomeStyler Backend Setup

A simple Node.js backend with MongoDB for managing reviews for the KKMA HomeStyler portfolio website.

## Features

- **POST /api/reviews** - Submit a new review
- **GET /api/reviews** - Retrieve all reviews
- **GET /api/rating** - Get rating statistics (average, total count, distribution)
- **GET /api/health** - Health check endpoint
- MongoDB database integration with Mongoose
- Input validation and sanitization
- CORS enabled for frontend integration
- Helmet security headers
- Auto-initialization with sample data

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. **Navigate to backend folder and install Node.js dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up MongoDB:**

   **Option A: Local MongoDB**
   - Install MongoDB on your system
   - Start MongoDB service
   - Default connection string will work: `mongodb://localhost:27017/kkma_homestyler`

   **Option B: MongoDB Atlas (Cloud)**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Update the `.env` file with your Atlas connection string

3. **Configure environment variables:**

   Update the `.env` file with your configuration:
   ```env
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/kkma_homestyler

   # For MongoDB Atlas:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kkma_homestyler?retryWrites=true&w=majority
   ```

## Running the Backend

1. **Navigate to backend folder and start the server:**
   ```bash
   cd backend

   # For development (with auto-restart)
   npm run dev

   # For production
   npm start
   ```

2. **Server will start on:** `http://localhost:5001`

## API Endpoints

### Submit a Review
```http
POST /api/reviews
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "rating": 5,
  "comment": "Great service!"
}
```

### Get All Reviews
```http
GET /api/reviews
```

### Get Rating Statistics
```http
GET /api/rating
```

### Health Check
```http
GET /api/health
```

## Database Schema

The `Review` collection stores:

- `name` (String, required, max 100 chars)
- `email` (String, required, validated format)
- `rating` (Number, required, 1-5)
- `comment` (String, optional, max 1000 chars)
- `date` (Date, auto-generated)
- `isApproved` (Boolean, default: true)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)

## Environment Variables

- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string

## Security Features

- Input validation and sanitization
- Email format validation
- Rating range validation (1-5)
- CORS protection
- Helmet security headers
- MongoDB injection protection via Mongoose

## Frontend Integration

The frontend is already configured to connect to this backend at `http://localhost:5001/api`.

No changes needed in the frontend - it will automatically work once the backend is running.

## Deployment Notes

### For Production:

1. **Environment Setup:**
   ```bash
   export NODE_ENV=production
   export MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   ```

2. **Install PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "kkma-backend"
   ```

3. **Use MongoDB Atlas for cloud database**

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error:**
   - Make sure MongoDB is running locally
   - Check your MONGODB_URI in .env file
   - Verify network connection for MongoDB Atlas

2. **Port Already in Use:**
   - Kill process using port 5001: `sudo lsof -ti:5001 | xargs kill -9`
   - Or change PORT in .env file

3. **Permission Denied:**
   - Run with proper permissions or change port

4. **Module Not Found:**
   - Run `npm install` to install all dependencies

## File Structure

```
KKMA_HomeStyler/
├── backend/               # Backend folder
│   ├── server.js          # Main backend server file
│   ├── package.json       # Node.js dependencies and scripts
│   ├── .env               # Environment variables
│   ├── .gitignore         # Git ignore file for backend
│   ├── BACKEND_SETUP.md   # This file
│   └── models/            # MongoDB models
│       └── Review.js      # Review schema and model
├── index.html             # Frontend HTML
├── styles.css             # Frontend CSS
├── script.js              # Frontend JavaScript
└── README.md              # Main project documentation
```

## License

MIT License - feel free to use for your projects