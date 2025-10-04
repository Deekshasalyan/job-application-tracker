// routes/applicationsRoutes.js

import express from 'express';
// Import controllers
import { 
    createApplication, 
    getApplications, 
    updateApplication, 
    deleteApplication,
    showStats
} from '../controllers/applicationsController.js'; 
// Import middleware
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Apply the 'protect' middleware to ALL application routes for security
router.route('/stats').get(protect, showStats); // Should be before '/:id' to avoid confusion

router
    .route('/')
    .post(protect, createApplication) // POST to create
    .get(protect, getApplications);  // GET to fetch all

router
    .route('/:id')
    .patch(protect, updateApplication) // PATCH to update by ID
    .delete(protect, deleteApplication); // DELETE to remove by ID

export default router;