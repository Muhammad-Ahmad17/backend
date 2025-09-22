const express = require('express');
const router = express.Router();

// Basic health check route
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API is running successfully',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mongodb: 'Connected'
    });
});

// Test route
router.get('/test', (req, res) => {
    res.json({
        message: 'Test route working!',
        environment: process.env.NODE_ENV || 'development',
        version: process.env.API_VERSION || 'v1'
    });
});

// Sample data route (you can expand this later)
router.get('/data', (req, res) => {
    const sampleData = [
        { id: 1, name: 'Sample Item 1', category: 'Category A' },
        { id: 2, name: 'Sample Item 2', category: 'Category B' },
        { id: 3, name: 'Sample Item 3', category: 'Category A' }
    ];

    res.json({
        success: true,
        count: sampleData.length,
        data: sampleData
    });
});

// POST route example
router.post('/echo', (req, res) => {
    res.json({
        message: 'Echo endpoint - received your data',
        receivedData: req.body,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;