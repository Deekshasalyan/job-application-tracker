// routes/authRoutes.js

import express from 'express';
// Import controllers
import { 
    register, 
    login, 
    getCurrentUser, 
    updateUser 
} from '../controllers/authController.js'; 
// Import middleware
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Public Routes (no token required)
router.route('/register').post(register);
router.route('/login').post(login);

// Private Routes (token required)
// The 'protect' middleware ensures only authenticated users can access these
router.route('/currentUser').get(protect, getCurrentUser);
router.route('/updateUser').patch(protect, updateUser);

export default router;