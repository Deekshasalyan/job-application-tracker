import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Adjust path and ensure you use .js extension

// Helper function to generate a JWT
const createJWT = (id) => {
    // Uses JWT_SECRET from your .env file
    return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token validity period
    });
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please enter all fields: name, email, and password.');
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists. Please login.');
    }

    // 3. Create the user
    // The password hashing is handled by the pre('save') middleware in User.js
    const user = await User.create({
        name,
        email,
        password,
    });

    // 4. Respond with user data and token
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: createJWT(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// /**
//  * @desc    Authenticate user & get token
//  * @route   POST /api/v1/auth/login
//  * @access  Public
//  */
// const login = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;

//     // 1. Basic validation
//     if (!email || !password) {
//         res.status(400);
//         throw new Error('Please provide email and password.');
//     }

//     // 2. Check for user email in database
//     const user = await User.findOne({ email });

//     // DEBUG: show whether user was found (do not log passwords)
//     console.debug('[auth] login attempt for:', email, 'userFound:', !!user);

//     // 3. Check password using the matchPassword method in User.js
//     const isMatch = user ? await user.matchPassword(password) : false;
//     console.debug('[auth] password match:', isMatch);

//     if (user && isMatch) {
//         res.json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             token: createJWT(user._id),
//         });
//     } else {
//         res.status(401); // Unauthorized
//         throw new Error('Invalid credentials');
//     }
// });
/**
 * @desc    Authenticate user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password.');
    }

    // 2. FIND THE USER AND EXPLICITLY SELECT THE PASSWORD HASH
    // This returns a Mongoose Document instance, allowing matchPassword to work.
    const user = await User.findOne({ email }).select('+password'); // <--- ADDED .select('+password')

    // 3. Check password using the matchPassword method in User.js
    if (user && (await user.matchPassword(password))) {
        // ... (rest of the successful login logic)
        // ... (Remember to exclude the password before sending the response)
        
        // Remove password from the user object before sending it back
        user.password = undefined; 
        
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: createJWT(user._id),
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error('Invalid credentials');
    }
});
/**
 * @desc    Get the currently logged-in user data
 * @route   GET /api/v1/auth/currentUser
 * @access  Private (Requires JWT)
 */
const getCurrentUser = asyncHandler(async (req, res) => {
    // req.user is available because the 'protect' middleware already verified the JWT 
    // and fetched the user (excluding the password)
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        // You can add other profile fields here if needed
    };
    res.status(200).json(user);
});


/**
 * @desc    Update user details
 * @route   PATCH /api/v1/auth/updateUser
 * @access  Private (Requires JWT)
 */
const updateUser = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    
    // Find the user using the ID attached by the 'protect' middleware
    const user = await User.findById(req.user._id);

    if (user) {
        // Update fields if provided
        user.name = name || user.name;
        user.email = email || user.email;
        // Password update should typically be handled in a separate route/controller

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: createJWT(updatedUser._id), // Generate a new token with updated details
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


export {
    register,
    login,
    getCurrentUser,
    updateUser,
};