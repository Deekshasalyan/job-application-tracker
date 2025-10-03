const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');

// @desc    Create new application
// @route   POST /api/applications
// @access  Private (placeholder)
const createApplication = asyncHandler(async (req, res) => {
  const { company, position, status, location, notes } = req.body;
  if (!company || !position) {
    res.status(400);
    throw new Error('Company and position are required');
  }

  const application = await Application.create({
    user: req.user ? req.user._id : null,
    company,
    position,
    status,
    location,
    notes,
  });

  res.status(201).json(application);
});

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private (placeholder)
const getApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({}).populate('user', 'name email');
  res.json(applications);
});

module.exports = {
  createApplication,
  getApplications,
};
