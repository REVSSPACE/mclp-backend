const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: '*',
    credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/files', require('./routes/files'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/documents', require('./routes/documents'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'MCLP Backend is running',
        timestamp: new Date().toISOString(),
        env: {
            nodeEnv: process.env.NODE_ENV,
            hasMongoUri: !!process.env.MONGODB_URI,
            hasJwtSecret: !!process.env.JWT_SECRET
        }
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Get MongoDB URI from environment
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

// Validate environment variables
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    console.error('Please set it in your deployment platform (Render)');
    process.exit(1);
}

// MongoDB Connection
console.log('🔄 Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
        
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 MCLP Backend Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 Health check: /api/health`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.error('Connection string starts with:', MONGODB_URI?.substring(0, 20) + '...');
        process.exit(1);
    });