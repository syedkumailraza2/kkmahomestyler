# Vercel Deployment Guide - K.K.M.A. Homestyler API

This guide explains how to deploy the K.K.M.A. Homestyler backend API to Vercel.

## Prerequisites

- Vercel account (free tier is sufficient)
- MongoDB Atlas account (for production database)
- GitHub repository (recommended)

## Step 1: Prepare MongoDB Atlas

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (free tier)
   - Select a cloud provider and region closest to your users

3. **Configure Database Access:**
   - Go to "Database Access" → "Add New Database User"
   - Create a username and strong password
   - Grant read/write permissions

4. **Whitelist IP Addresses:**
   - Go to "Network Access" → "Add IP Address"
   - For Vercel deployment, add: `0.0.0.0/0` (allows access from anywhere)
   - **Security Note:** This is necessary for serverless functions

5. **Get Connection String:**
   - Go to "Database" → "Connect" → "Drivers"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/kkma_homestyler?retryWrites=true&w=majority`

## Step 2: Deploy to Vercel

### Option A: Through Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from Backend Directory:**
   ```bash
   cd backend
   vercel
   ```

4. **Follow the Prompts:**
   - Link to existing project or create new one
   - Confirm project settings
   - Set up environment variables when prompted

### Option B: Through Vercel Dashboard

1. **Connect GitHub Repository:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the `backend` folder as root directory

2. **Configure Build Settings:**
   - Framework Preset: "Other"
   - Root Directory: `backend`
   - Build Command: `echo 'No build step required'`
   - Output Directory: `.`

3. **Add Environment Variables:**
   Go to "Environment Variables" section and add:

   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kkma_homestyler?retryWrites=true&w=majority
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   JWT_SECRET=your-super-secure-jwt-secret-key-for-production
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

## Step 3: Configure Environment Variables in Vercel

After deployment, you must configure environment variables:

1. **Go to Vercel Dashboard:**
   - Select your project
   - Go to "Settings" → "Environment Variables"

2. **Add Required Variables:**

   ### Database Configuration
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kkma_homestyler?retryWrites=true&w=majority
   ```

   ### Security
   ```
   JWT_SECRET=your-super-secure-jwt-secret-key-for-production-change-this
   BCRYPT_ROUNDS=12
   ```

   ### CORS Configuration
   ```
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

   ### Rate Limiting
   ```
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Redeploy:**
   - After adding environment variables, trigger a new deployment
   - Or push a small change to GitHub

## Step 4: Update Frontend API URL

After deployment, update your frontend to use the new Vercel API URL:

1. **Get Your Vercel API URL:**
   - From Vercel dashboard, copy your deployment URL
   - Example: `https://kkma-homestyler-api.vercel.app`

2. **Update Frontend Configuration:**
   In your `script.js`, update the API base URL:
   ```javascript
   const API_BASE_URL = 'https://kkma-homestyler-api.vercel.app/api/v1';
   ```

## Step 5: Run Migration (One-time Setup)

Since Vercel is serverless, you need to run the migration once:

1. **Create Migration Script:**
   Create a temporary script `scripts/vercel-migrate.js`:
   ```javascript
   const mongoose = require('mongoose');
   const Review = require('../src/models/Review');
   require('dotenv').config();

   const migrate = async () => {
     try {
       await mongoose.connect(process.env.MONGODB_URI);
       console.log('Connected to MongoDB');

       // Check if reviews exist
       const count = await Review.countDocuments();
       if (count === 0) {
         const seedData = [
           {
             name: 'Sarah Johnson',
             email: 'sarah.johnson@email.com',
             rating: 5,
             comment: 'Absolutely fantastic work! K.K.M.A. Homestyler transformed our living space beyond our expectations.',
             approved: true
           },
           // ... other seed data
         ];
         await Review.insertMany(seedData);
         console.log('Sample reviews inserted');
       }

       await mongoose.disconnect();
       console.log('Migration completed');
     } catch (error) {
       console.error('Migration failed:', error);
       process.exit(1);
     }
   };

   migrate();
   ```

2. **Run Migration Locally:**
   ```bash
   cd backend
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kkma_homestyler node scripts/vercel-migrate.js
   ```

## Step 6: Test the Deployment

1. **Test API Endpoints:**
   ```bash
   # Test health endpoint
   curl https://your-api-url.vercel.app/api/health

   # Test reviews endpoint
   curl https://your-api-url.vercel.app/api/v1/reviews/statistics
   ```

2. **Test Frontend Integration:**
   - Open your frontend website
   - Navigate to Reviews section
   - Test submitting a review
   - Verify data persistence

## Vercel Configuration Details

### vercel.json Structure
- **Builds**: Creates serverless function from `api/index.js`
- **Routes**: Routes all requests to the serverless function
- **Functions**: Configures 30s timeout and 1GB memory
- **Headers**: Adds CORS headers for all routes

### Serverless Function (api/index.js)
- Wraps Express app for Vercel compatibility
- Handles CORS headers
- Manages preflight OPTIONS requests

### Environment-Specific Code
- Detects Vercel environment via `process.env.VERCEL`
- Only starts server when not in Vercel
- Exports Express app as module for serverless

## Troubleshooting

### Common Issues

1. **MongoDB Connection Timeout:**
   - Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
   - Check connection string format
   - Verify database user permissions

2. **CORS Errors:**
   - Verify `FRONTEND_URL` environment variable
   - Check CORS headers in browser dev tools
   - Ensure frontend URL matches exactly

3. **Cold Start Delays:**
   - First request may be slower (serverless cold start)
   - Subsequent requests should be faster
   - Consider using Vercel Pro for reduced cold starts

4. **Environment Variables Not Working:**
   - Ensure variables are added in Vercel dashboard
   - Trigger redeploy after adding variables
   - Check variable names don't have typos

### Debug Steps

1. **Check Vercel Function Logs:**
   - Go to Vercel dashboard → Functions tab
   - View real-time logs and error messages

2. **Test Individual Endpoints:**
   ```bash
   # Test health
   curl -X GET https://your-api-url.vercel.app/api/health

   # Test reviews
   curl -X GET https://your-api-url.vercel.app/api/v1/reviews/statistics
   ```

3. **Monitor MongoDB Atlas:**
   - Check connection metrics in Atlas dashboard
   - Review slow queries and performance

## Production Considerations

### Security
- Use strong JWT secret
- Enable MongoDB Atlas authentication
- Monitor API usage and rate limiting
- Set up Vercel Analytics

### Performance
- Consider MongoDB Atlas paid tier for better performance
- Monitor Vercel function execution time
- Optimize database queries and indexes

### Monitoring
- Set up Vercel Analytics
- Configure MongoDB Atlas alerts
- Monitor error rates and response times

## Cost Analysis

### Vercel (Free Tier)
- 100GB bandwidth/month
- 100 serverless function invocations/day
- 10GB storage
- Sufficient for small to medium projects

### MongoDB Atlas (Free Tier)
- 512MB storage
- Shared cluster with some performance limitations
- Suitable for development and small projects

### Upgrade Recommendations
- Upgrade to Vercel Pro for $20/month if needed
- MongoDB Atlas M0 cluster is free but consider M2 ($25/month) for better performance

Your K.K.M.A. Homestyler API is now ready for production deployment on Vercel! 🚀