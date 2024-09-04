// Import express module
const express = require('express');
const testController = require('../controllers/testController');

// Create a router object
const router = express.Router();

// Define routes
router.get('/test', testController);

// Export the router object
module.exports = router;