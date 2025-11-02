# K.K.M.A. Homestyler - Frontend-Backend Integration Guide

## Overview

This guide explains how to set up and test the complete integration between the MongoDB backend and the frontend of the K.K.M.A. Homestyler application.

## Prerequisites

- Node.js (>= 16.0.0)
- npm (>= 8.0.0)
- MongoDB (>= 4.4) - either locally installed or MongoDB Atlas

## Setup Instructions

### 1. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd "backend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/kkma_homestyler
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Ensure MongoDB is running:**
   ```bash
   # For local MongoDB
   sudo systemctl start mongod

   # Or check if it's running
   mongosh --eval "db.adminCommand('ismaster')"
   ```

5. **Run database migration:**
   ```bash
   npm run migrate
   ```
   This will:
   - Connect to MongoDB
   - Create necessary indexes
   - Insert sample review data (3 reviews)
   - Test the aggregation pipeline

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

   You should see: `Server running in development mode on port 5000`

### 2. Frontend Setup

1. **Navigate to the main directory:**
   ```bash
   cd ..
   ```

2. **The frontend is already updated** to connect to the MongoDB backend. The integration includes:
   - API calls to `http://localhost:5000/api/v1/reviews`
   - Comprehensive error handling
   - Loading states and user feedback
   - Automatic review refresh after submission

3. **Open the main website:**
   ```bash
   # Open index.html in your browser
   # Or use a simple server:
   python3 -m http.server 3000
   # Then visit http://localhost:3000
   ```

### 3. Testing the Integration

#### Option A: Use the Integration Test Page

1. **Open the test page:**
   ```bash
   # Open test-integration.html in your browser
   open test-integration.html
   ```

2. **Test all API endpoints:**
   - Click "Test API Health" - Should show successful connection
   - Click "Load Statistics" - Should show rating statistics
   - Click "Load Reviews" - Should show the sample reviews
   - Submit a test review - Should successfully add a new review

#### Option B: Test on the Main Website

1. **Navigate to the Reviews section** of the main website
2. **Verify the following:**
   - Sample reviews are displayed (3 reviews from migration)
   - Rating statistics show the correct numbers
   - Submit a new review successfully
   - New review appears after page refresh (reviews need admin approval)

## API Endpoints

### Reviews API (`/api/v1/reviews`)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/v1/reviews` | Get all approved reviews | Array of review objects |
| GET | `/api/v1/reviews/statistics` | Get rating statistics | Stats object with average and distribution |
| POST | `/api/v1/reviews` | Submit a new review | Success message |
| GET | `/api/v1/reviews/:id` | Get review by ID | Review object |
| DELETE | `/api/v1/reviews/:id` | Delete review (admin) | Success message |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health check |
| GET | `/health` | Server uptime check |

## Frontend Integration Features

### ✅ Implemented Features

1. **API Integration**
   - Automatic loading of reviews and statistics on page load
   - Real-time review submission with form validation
   - Automatic refresh of data after successful submission

2. **Error Handling**
   - Network error detection and user-friendly messages
   - Server validation error display
   - CORS issue handling
   - Fallback to empty state if API fails

3. **User Experience**
   - Loading spinners during API calls
   - Toast notifications for success/error messages
   - Form validation with visual feedback
   - Disabled submit button during submission

4. **Data Management**
   - Parallel loading of reviews and statistics for better performance
   - Proper response format handling from MongoDB backend
   - Email duplication prevention (backend-enforced)

### 🔧 Key Functions

- `apiRequest()` - Centralized API request handler with error handling
- `submitRating()` - Review submission with validation
- `loadReviewsFromAPI()` - Fetches reviews from backend
- `loadStatisticsFromAPI()` - Fetches rating statistics
- `showReviewsLoading()` - Shows loading state
- `showToast()` - Displays user notifications

## Troubleshooting

### Common Issues

1. **Backend not starting:**
   ```bash
   # Check if MongoDB is running
   mongosh --eval "db.adminCommand('ismaster')"

   # Check port 5000 is not in use
   lsof -i :5000
   ```

2. **Frontend can't connect to backend:**
   - Ensure backend is running on `localhost:5000`
   - Check CORS configuration in `.env` file
   - Verify no firewall blocking the connection

3. **Reviews not appearing:**
   - Check if reviews were inserted during migration
   - Verify `approved: true` field in database
   - Check browser console for API errors

4. **MongoDB connection issues:**
   ```bash
   # Test MongoDB connection
   mongosh "mongodb://localhost:27017/kkma_homestyler"

   # Check if database exists
   show dbs
   use kkma_homestyler
   show collections
   ```

### Debug Steps

1. **Check Backend Logs:**
   ```bash
   # Backend logs show API requests and errors
   npm run dev
   ```

2. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Check Network tab for API requests
   - Look for JavaScript errors in Console tab

3. **Test API Directly:**
   ```bash
   # Test health endpoint
   curl http://localhost:5000/api/health

   # Test reviews endpoint
   curl http://localhost:5000/api/v1/reviews/statistics
   ```

## Data Structure

### Review Object (Backend → Frontend)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Sarah Johnson",
  "email": "sarah.johnson@email.com",
  "rating": 5,
  "comment": "Excellent service!",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "createdAtFormatted": "January 15, 2024"
}
```

### Statistics Object
```json
{
  "totalReviews": 25,
  "averageRating": 4.8,
  "ratingDistribution": {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 8,
    "5": 14
  }
}
```

## Next Steps

### For Development
1. Start both backend and frontend servers
2. Use the integration test page to verify all functionality
3. Test the complete user flow on the main website

### For Production
1. Update `FRONTEND_URL` in `.env` to production domain
2. Use MongoDB Atlas for production database
3. Set up proper HTTPS and security headers
4. Configure monitoring and logging

## Support

If you encounter any issues during setup:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Use the integration test page to isolate issues
4. Check browser console and backend logs for specific errors

The integration is now complete and ready for testing! 🎉