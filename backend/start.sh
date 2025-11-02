#!/bin/bash

# K.K.M.A. Homestyler Backend Startup Script

echo "🚀 Starting K.K.M.A. Homestyler Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating environment file..."
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo "💡 Please edit .env file with your configuration before running in production"
fi

# Run database migration
echo "🗄️  Running database migration..."
npm run migrate
if [ $? -ne 0 ]; then
    echo "❌ Database migration failed"
    exit 1
fi

# Start the server
echo "🌟 Starting server..."
if [ "$1" = "dev" ]; then
    echo "🔧 Development mode"
    npm run dev
else
    echo "🚀 Production mode"
    npm start
fi