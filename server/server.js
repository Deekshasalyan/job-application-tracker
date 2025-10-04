// const express = require('express');
// const dotenv = require('dotenv');
// const helmet = require('helmet');
// const cors = require('cors');
// const rateLimit = require('express-rate-limit');
// const mongoSanitize = require('express-mongo-sanitize');
// const connectDB = require('./config/db');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(helmet());
// app.use(cors());
// app.use(express.json());
// app.use(mongoSanitize());

// const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
// app.use(limiter);

// app.use('/api/applications', require('./routes/applicationsRoutes'));

// app.get('/', (req, res) => res.send('Job Application Tracker API'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// server.js

import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors'; // Imports express-async-errors to handle async errors globally

// Database connection function (assuming you have a db.js in config)
import connectDB from './config/db.js'; 

// Middleware
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Routes
import authRouter from './routes/authRoutes.js';
import applicationsRouter from './routes/applicationsRoutes.js';

// --- Configuration ---
dotenv.config(); // Load environment variables from .env
const app = express();
connectDB(); // Execute the database connection

// Ensure a development JWT secret exists (do not use in production)
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'dev_jwt_secret_please_change';
}

// Global error handlers to capture unexpected crashes and promise rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception - shutting down gracefully');
    console.error(err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('beforeExit', (code) => {
    console.log('Process beforeExit event with code:', code);
});

process.on('exit', (code) => {
    console.log('Process exit event with code:', code);
});

// --- Built-in Middleware ---
app.use(express.json()); // Allows server to accept JSON data in the request body

// --- Routes Middleware ---

// Health Check / Test Route (Optional, but useful)
app.get('/', (req, res) => {
    res.send('API is running successfully!');
});

// Primary Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/applications', applicationsRouter);

// --- Custom Error Middleware (MUST be last) ---
app.use(notFound);      // Handles 404 routes
app.use(errorHandler);  // Handles all other errors

// --- Start Server ---
const PORT = process.env.PORT || 5000;

const env = process.env.NODE_ENV || 'development';
app.listen(PORT, () =>
    console.log(`Server running in ${env} mode on port ${PORT}`)
);