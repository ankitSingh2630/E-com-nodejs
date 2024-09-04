const express = require("express");
const {isAuth, isAdmin, } = require("../middlewares/authMiddleware.js");
const { createOrderController, getAllOrderController, getSingleOrderController, getAllAdminOrdersController, changeOrderStatusController } = require("../controllers/OrderController.js");

const router = express.Router();

// routes

// create category
router.post('/create', isAuth,createOrderController)

// get all order
router.get("/my-orders",isAuth, getAllOrderController )


// get single order details
router.get("/my-orders/:id", isAuth, getSingleOrderController )

// ADMIN part
// get all orders by admin
router.get('/admin/get-all-orders', isAuth, isAdmin, getAllAdminOrdersController)

// change order stratus by admin
router.put("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController)

module.exports = router;
