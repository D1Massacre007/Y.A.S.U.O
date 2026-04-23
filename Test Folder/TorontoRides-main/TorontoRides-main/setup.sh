#!/bin/bash

echo "🚗 Toronto Riders Backend Setup"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if MongoDB is running
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
else
    echo "⚠️  MongoDB not found. Please install MongoDB."
    echo "   macOS: brew install mongodb-community"
    echo "   Ubuntu: sudo apt install mongodb"
fi

# Navigate to backend directory
cd backend

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your configuration"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MongoDB URI and JWT secret"
echo "2. Start MongoDB: brew services start mongodb-community (macOS)"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. The API will be available at http://localhost:5000"
echo ""
echo "📚 Check backend/README.md for API documentation"
echo "📚 Check INTEGRATION_GUIDE.md for frontend integration"
