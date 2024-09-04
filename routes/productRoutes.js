const express = require("express");
const {isAuth, isAdmin, }= require("../middlewares/authMiddleware.js");
const {getAllProductsController, getSingleProductController, createProductController, updateProductController, deleteProductController, deleteAllProductsController, updateProductImageController, productReviewController, getTopProductController} = require("../controllers/productController");
const singleUpload = require("../middlewares/multer.js");
const router = express.Router();

// Define routes
// Get all products
router.get('/get-all', getAllProductsController);
// Get top products
router.get('/get-top', getTopProductController);

// get single products
router.get("/singleproduct/:id", getSingleProductController);

// create products
router.post('/create',isAuth, isAdmin, singleUpload, createProductController)

// update product
router.put('/updateproduct/:id', isAuth, isAdmin, updateProductController); 

// update product image
router.put("/image/:id", isAuth,isAdmin, singleUpload,updateProductImageController )

// delete product
router.delete('/deleteproduct/:id', isAuth,isAdmin, singleUpload, deleteProductController)


// delete all product
router.delete('/deleteall', isAuth, isAdmin,singleUpload, deleteAllProductsController)

// review product
router.put("/:id/review", isAuth, productReviewController)
module.exports = router;