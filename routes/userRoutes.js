const express = require('express');
const {
    registerController,
    loginController,
    getUserProfileController,
    logOutController,
    updateProfileController,
    updatePasswordController,
    updateProfilePicController,
    passwordResetController,
} = require('../controllers/userController');
const multer = require('multer');
const {isAuth} = require("../middlewares/authMiddleware.js");
const singleUpload = require('../middlewares/multer.js');
const allupload = multer({ dest: 'uploads/' });
const rateLimit = require("express-rate-limit")

// for limiting the rate
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// Create the router object
const router = express.Router();

// Define the routes
// Register
router.post('/register', limiter, registerController);

// Login
router.post('/login', limiter, loginController);

// Get user profile (protected route)
router.get('/profile', isAuth, getUserProfileController);

// Logout
router.get('/logout', isAuth, logOutController);

// Update profile
router.put('/profile-update', isAuth, updateProfileController);

// Update password
router.put('/update-password', isAuth, updatePasswordController);

// Update profile picture
// router.put('/update-picture', isAuth, singleUpload, updateProfilePicController);
router.put("/update-picture", isAuth, singleUpload, updateProfilePicController);

// forgot password
router.post('/reset-password', passwordResetController)
// Export the router
module.exports = router;


