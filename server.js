const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const accountRoutes = require('./routes/accounts');
const documentRoutes = require('./routes/documents');

// Initialize app
const app = express();

/* =========================
   Middleware
========================= */

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (allow only frontend URL)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'; // set this in Render
app.use(cors({
    origin: FRONTEND_URL,
    optionsSuccessStatus: 200
}));

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

/* =========================
   Routes
========================= */

// Base API route
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

// Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/documents', documentRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'MCLP Backend is running',
        timestamp: new Date().toISOString()
    });
});

/* =========================
   Error Handling
========================= */

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

/* =========================
   MongoDB Connection + Server Start
========================= */

const MONGODB_URI = process.env.MONGODB_URI; // set in Render
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    });

/* =========================
   Handle Unhandled Rejections
========================= */

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    process.exit(1);
});

module.exports = app;