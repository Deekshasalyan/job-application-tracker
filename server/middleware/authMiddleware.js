// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js'; // Use .js extension

/**
 * @desc Protects private routes by verifying the JWT
 */
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check for token in the Authorization header (Format: "Bearer <token>")
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Extract the token (removing "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token using the secret from .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // 4. Find the user by ID and attach the user object to the request (req.user)
            // .select('-password') prevents the password hash from being attached
            req.user = await User.findById(decoded.userId).select('-password');

            next(); // Proceed to the next middleware or controller
        } catch (error) {
            console.error(error);
            // If verification fails or user not found
            res.status(401);
            throw new Error('Not authorized, token failed or invalid');
        }
    }

    // 5. If no token is found in the request
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }
});

export { protect };