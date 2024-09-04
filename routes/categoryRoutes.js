const express = require("express");
const {isAuth, isAdmin,} = require("../middlewares/authMiddleware.js");
const { createCategoryController, getAllCategoryController, deleteAllCategoryController, deleteIdController, updateCategoryController } = require("../controllers/categoryController.js");
const router = express.Router();

// routes

// create category
router.post('/create', isAuth, isAdmin, createCategoryController)

// get all category
router.get('/get-all', getAllCategoryController)

// get all category
router.delete('/delete-all', deleteAllCategoryController)

// delete id category
router.delete('/delete/:id', isAuth, isAdmin, deleteIdController)

// update category
router.put('/update/:id', isAuth, isAdmin,updateCategoryController)

module.exports = router;
