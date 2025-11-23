const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Import Cron Service
const cronService = require('./cron-service');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const connectDB = require('./config/database');
connectDB();

// Routes
app.use('/api', require('./routes'));

// Cron Service Management Endpoints
app.get('/cron/status', (req, res) => {
    res.json({
        success: true,
        stats: cronService.getStats()
    });
});

app.post('/cron/start', (req, res) => {
    try {
        const { schedule, url, method, timeout } = req.body;
        cronService.start({ enabled: true, schedule, url, method, timeout });
        res.json({
            success: true,
            message: 'Cron service started',
            stats: cronService.getStats()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

app.post('/cron/stop', (req, res) => {
    cronService.stop();
    res.json({
        success: true,
        message: 'Cron service stopped',
        stats: cronService.getStats()
    });
});

app.post('/cron/update-schedule', (req, res) => {
    try {
        const { schedule } = req.body;
        if (!schedule) {
            return res.status(400).json({
                success: false,
                message: 'Schedule is required'
            });
        }
        cronService.updateSchedule(schedule);
        res.json({
            success: true,
            message: 'Schedule updated',
            stats: cronService.getStats()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

app.post('/cron/update-url', (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'URL is required'
            });
        }
        cronService.updateUrl(url);
        res.json({
            success: true,
            message: 'URL updated',
            stats: cronService.getStats()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Basic route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login route (public)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Dashboard route (redirect to login if not authenticated)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard-enhanced.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.originalUrl
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Frontend available at: http://localhost:${PORT}`);

    // Start cron service if enabled
    cronService.start();
});

module.exports = app;