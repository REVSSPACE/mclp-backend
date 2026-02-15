#!/bin/bash

echo "=========================================="
echo "MCLP Backend Setup Script"
echo "Vethraa Ventures Pvt. Ltd."
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null
then
    echo "⚠️  MongoDB is not installed. Please install MongoDB."
    echo "   Visit: https://www.mongodb.com/try/download/community"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. Make sure MongoDB is running:"
echo "   mongod"
echo ""
echo "2. Update .env file with your configuration"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. API will be available at:"
echo "   http://localhost:5000/api"
echo ""
echo "5. Test the health check:"
echo "   curl http://localhost:5000/api/health"
echo ""
echo "=========================================="
echo "Happy coding! 🚀"
echo "=========================================="
