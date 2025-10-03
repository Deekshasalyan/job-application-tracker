const express = require('express');
const router = express.Router();
const { createApplication, getApplications } = require('../controllers/applicationsController');

router.route('/').get(getApplications).post(createApplication);

module.exports = router;

