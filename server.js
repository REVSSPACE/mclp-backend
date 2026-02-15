const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();


// Import routes
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const accountRoutes = require('./routes/accounts');
const documentRoutes = require('./routes/documents');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

app.get('/api', (req, res) => {
    res.json({
        message: 'MCLP API is running ✅',
        endpoints: [
            '/api/auth',
            '/api/files',
            '/api/accounts',
            '/api/documents',
            '/api/health'
        ]
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/documents', documentRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'MCLP Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ MongoDB Connected Successfully');
    
    // Start server
    const PORT = process.env.PORT || 5000;
   app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 MCLP Backend Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV}`);
        console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    });
})
.catch((error) => {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    process.exit(1);
});

module.exports = app;
