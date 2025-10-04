// controllers/applicationsController.js

import asyncHandler from 'express-async-handler';
import Application from '../models/Application.js'; // Use .js extension for ES6 modules

// Helper function to generate a JWT for successful registration/login
const generateToken = (id) => {
    // Assuming you have a JWT_SECRET in your .env
    return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // e.g., token expires in 30 days
    });
};

/**
 * @desc    Create new application
 * @route   POST /api/v1/applications
 * @access  Private
 */
const createApplication = asyncHandler(async (req, res) => {
    // Note: The userId is available via req.user._id from the protect middleware
    const { company, jobTitle, status, location, notes, jobUrl, salary, skills, followUpDate } = req.body;

    // 1. Basic validation
    if (!company || !jobTitle) {
        res.status(400);
        throw new Error('Company and Job Title are required fields.');
    }

    // 2. Create the application, ensuring it's linked to the authenticated user
    const application = await Application.create({
        company,
        jobTitle,
        status,
        location,
        notes,
        jobUrl,
        salary,
        skills,
        followUpDate,
        userId: req.user._id, // *** CRUCIAL: Link to the authenticated user ***
    });

    res.status(201).json(application);
});

/**
 * @desc    Get all applications for the authenticated user
 * @route   GET /api/v1/applications
 * @access  Private
 */
const getApplications = asyncHandler(async (req, res) => {
    // Only find applications belonging to the authenticated user (req.user._id)
    const applications = await Application.find({ userId: req.user._id }).sort({ dateApplied: -1 });

    res.status(200).json({ count: applications.length, applications });
});

/**
 * @desc    Update an application
 * @route   PATCH /api/v1/applications/:id
 * @access  Private
 */
const updateApplication = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 1. Find the application
    let application = await Application.findById(id);

    // 2. Check if application exists
    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    // 3. Security Check: Ensure the application belongs to the logged-in user
    if (application.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to update this application');
    }

    // 4. Update the application
    application = await Application.findByIdAndUpdate(id, req.body, {
        new: true, // Return the new document
        runValidators: true,
    });

    res.status(200).json(application);
});

/**
 * @desc    Delete an application
 * @route   DELETE /api/v1/applications/:id
 * @access  Private
 */
const deleteApplication = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 1. Find the application
    const application = await Application.findById(id);

    // 2. Check if application exists
    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    // 3. Security Check: Ensure the application belongs to the logged-in user
    if (application.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to delete this application');
    }

    // 4. Delete the application
    await application.deleteOne(); // Use .deleteOne() or .remove() based on Mongoose version

    res.status(200).json({ message: 'Application deleted successfully' });
});

/**
 * @desc    Get applications statistics (e.g., count by status)
 * @route   GET /api/v1/applications/stats
 * @access  Private
 */
const showStats = asyncHandler(async (req, res) => {
    // Use Mongoose aggregation pipeline
    const stats = await Application.aggregate([
        // 1. Match: Filter documents to only include the logged-in user's applications
        { $match: { userId: req.user._id } }, 
        // 2. Group: Group by the 'status' field and count the documents in each group
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Format the stats for easier frontend consumption (optional, but good practice)
    const formattedStats = stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
    }, {});
    
    // Default structure for statuses that might not exist in the DB yet
    const defaultStats = {
        Applied: formattedStats.Applied || 0,
        Interviewing: formattedStats.Interviewing || 0,
        Offer: formattedStats.Offer || 0,
        Rejected: formattedStats.Rejected || 0,
    };

    res.status(200).json({ defaultStats, totalApplications: defaultStats.Applied + defaultStats.Interviewing + defaultStats.Offer + defaultStats.Rejected });
});

export {
    createApplication,
    getApplications,
    updateApplication,
    deleteApplication,
    showStats,
};