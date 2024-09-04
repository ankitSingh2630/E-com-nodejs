// const orderModel = require("../models/orderModel.js");
// const productModel = require("../models/productModel.js");
// const logger = require("../controllers/logger.js")
// // create order
// const createOrderController = async(req,res)=>{
//     try{
//          const {shippingInfo, orderItems, paymentMethod, paymentInfo, itemPrice, tax, shippingCharges, totalAmount} = req.body;
//         //  validation
//         if(!shippingInfo || !orderItems || !paymentMethod || !paymentInfo || !itemPrice || !tax || !shippingCharges  ||!totalAmount ){
//             return res.status(404).send({
//                 sucees:false,
//                 message :"please provide  required information"
//             })
//         }
//         // create order
//         await orderModel.create({
//             user: req.user._id,
//             shippingInfo,
//             orderItems, 
//             paymentMethod, paymentInfo, 
//             itemPrice, 
//             tax, 
//             shippingCharges, totalAmount,

//         })

//         // stock update
//         // Stock update
//         for (let i = 0; i < orderItems.length; i++) {
//             // Find product
//             const product = await productModel.findById(orderItems[i].product);
//             if (!product) {
//                 return res.status(404).json({
//                     success: false,
//                     message: `Product with ID ${orderItems[i].product} not found`
//                 });
//             }
//             product.stock -= orderItems[i].quantity;
//             await product.save();
//         }
//         res.status(201).send({
//             sucees:true,
//             message : "Order Placed Successfully"
//         });
//     }catch(error){
//          console.log(error);
//          res.status(500).send({
//             success:false,
//             message:"Error in Create Order API",
//             error:error.message
//          })
//     }
// };

// // json for create order
// // {
//     //     "shippingInfo": {
//     //         "address": "mumbai",
//     //         "city": "delhi",
//     //         "country": "India"
//     //     },
//     //     "orderItems": [
//     //         {
//     //             "name": "iphone 16",
//     //             "price": 150000,
//     //             "stock": 25,
//     //             "quantity": 1,
//     //             "image": "",
//     //             "product": ""
//     //         }
//     //     ],
//     //     "paymentMethod": "ONLINE",
//     //     "paymentInfo": {
//     //         "id": "",
//     //         "status": "succeeded"
//     //     },
//     //     "itemPrice": 999,
//     //     "tax": 1,
//     //     "shippingCharges": 1,
//     //     "totalAmount": 150001
//     // }

// // get all orders
// const getAllOrderController = async(req,res)=>{
//     try{
//         const orders = await orderModel.find({user:req.user._id})
//         // validation
//         if(!orders){
//             return res.status(404).send({
//                 success:false,
//                 message:"no order found"
//             })
//         }
//         res.status(200).send({
//             success:true,
//             message: "orders fetched successfully",
//             totalOrders : orders.length,
//             orders,
//         })
//     }catch(error){
//          console.log(error);
//          res.status(500).send({
//             success:false,
//             message:"Error in Create Order API",
//             error:error.message
//          })
//     }
// }

// // get single order
// const getSingleOrderController = async(req,res)=>{
//     try{
//         // find orders
//         const order = await orderModel.findById(req.params.id);
//         // validation
//         if(!order){
//             return res.status(404).send({
//                 sucees:false,
//                 message: "no order found"
//             })
//         }
//         res.status(200).send({
//             success: true,
//             message : "your order fetched",
//             order
//         })
//     }catch(error){
//          console.log(error);
//          // cast error object id
//         if(error.name === 'CastError'){
//             return res.status(500).send({
//                 success:false,
//                 message: "invalid id",
//                 // error,
//             })
//         }
//          res.status(500).send({
//             success:false,
//             message:"Error in Create Order API",
//             error:error.message
//          })
//     }
// }
// module.exports = {
//     createOrderController,
//     getAllOrderController,
//     getSingleOrderController
// }

const { error } = require("winston");
const orderModel = require("../models/orderModel.js");
const productModel = require("../models/productModel.js");
const logger = require("./logger.js"); // adjust path as needed

// Create order
const createOrderController = async (req, res) => {
  try {
    const { shippingInfo, orderItems, paymentMethod, paymentInfo, itemPrice, tax, shippingCharges, totalAmount } = req.body;

    // Validation
    if (!shippingInfo || !orderItems || !paymentMethod || !paymentInfo || !itemPrice || !tax || !shippingCharges || !totalAmount) {
      logger.error({
        message: 'Validation error: Missing required fields',
        label: 'CreateOrder',
        method: req.method,
        route: req.originalUrl,
        ip: req.ip,
        statusCode: 400,
        response: 'Please provide all required information'
      });
      return res.status(400).send({
        success: false,
        message: "Please provide all required information"
      });
    }

    // Create order
    const order = await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });

    // Stock update
    for (let i = 0; i < orderItems.length; i++) {
      // Find product
      const product = await productModel.findById(orderItems[i].product);
      if (!product) {
        logger.error({
          message: `Product not found for ID ${orderItems[i].product}`,
          label: 'CreateOrder',
          method: req.method,
          route: req.originalUrl,
          ip: req.ip,
          statusCode: 404,
          response: `Product with ID ${orderItems[i].product} not found`
        });
        return res.status(404).json({
          success: false,
          message: `Product with ID ${orderItems[i].product} not found`
        });
      }
      product.stock -= orderItems[i].quantity;
      await product.save();
    }

    logger.info({
      message: 'Order created successfully',
      label: 'CreateOrder',
      method: req.method,
      route: req.originalUrl,
      ip: req.ip,
      statusCode: 201,
      response: 'Order Placed Successfully'
    });

    res.status(201).send({
      success: true,
      message: "Order Placed Successfully",
      order
    });
  } catch (error) {
    logger.error({
      message: 'Error in Create Order API',
      label: 'CreateOrder',
      method: req.method,
      route: req.originalUrl,
      ip: req.ip,
      statusCode: 500,
      response: error.message
    });
    res.status(500).send({
      success: false,
      message: "Error in Create Order API",
      error: error.message
    });
  }
};

// Get all orders
const getAllOrderController = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id });

    if (!orders || orders.length === 0) {
      logger.error({
        message: 'No orders found',
        label: 'GetAllOrders',
        method: req.method,
        route: req.originalUrl,
        ip: req.ip,
        statusCode: 404,
        response: 'No orders found'
      });
      return res.status(404).send({
        success: false,
        message: "No orders found"
      });
    }

    logger.info({
      message: 'Orders fetched successfully',
      label: 'GetAllOrders',
      method: req.method,
      route: req.originalUrl,
      ip: req.ip,
      statusCode: 200,
      response: 'Orders fetched successfully'
    });

    res.status(200).send({
      success: true,
      message: "Orders fetched successfully",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    logger.error({
      message: 'Error in Get All Orders API',
      label: 'GetAllOrders',
      method: req.method,
      route: req.originalUrl,
      ip: req.ip,
      statusCode: 500,
      response: error.message
    });
    res.status(500).send({
      success: false,
      message: "Error in Get All Orders API",
      error: error.message
    });
  }
};

// Get single order
const getSingleOrderController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      logger.error({
        message: 'No order found',
        label: 'GetSingleOrder',
        method: req.method,
        route: req.originalUrl,
        ip: req.ip,
        statusCode: 404,
        response: 'No order found'
      });
      return res.status(404).send({
        success: false,
        message: "No order found"
      });
    }

    logger.info({
      message: 'Order fetched successfully',
      label: 'GetSingleOrder',
      method: req.method,
      route: req.originalUrl,
      ip: req.ip,
      statusCode: 200,
      response: 'Order fetched successfully'
    });

    res.status(200).send({
      success: true,
      message: "Your order fetched",
      order
    });
  } catch (error) {
    if (error.name === 'CastError') {
      logger.error({
        message: 'Invalid ID',
        label: 'GetSingleOrder',
        method: req.method,
        route: req.originalUrl,
        ip: req.ip,
        statusCode: 400,
        response: 'Invalid ID'
      });
      return res.status(400).send({
        success: false,
        message: "Invalid ID",
      });
    }
    logger.error({
      message: 'Error in Get Single Order API',
      label: 'GetSingleOrder',
      method: req.method,
      route: req.originalUrl,
      ip: req.ip,
      statusCode: 500,
      response: error.message
    });
    res.status(500).send({
      success: false,
      message: "Error in Get Single Order API",
      error: error.message
    });
  }
}

// admin section
const getAllAdminOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).send({
      success: true,
      message: "All orders DATA",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching all admin orders:", error);
    res.status(500).send({
      success: false,
      message: "Error in getting all admin orders by admin",
      error: error.message,
    });
  }
};
const changeOrderStatusController = async(req,res)=>{
    try{
      // find order
      const order = await orderModel.findById(req.params.id)
      // validation
      if(!order){
        return res.status(404).send({
          success:false,
          message:"order not found"
        })
      };
      if(order.orderStatus=== "processing") {
        order.orderStatus = "shipped"
      }else if(order.orderStatus=== "shipped"){
        order.orderStatus = "delivered"
        order.deliveredAt = Date.now()
      }else{
        return res.status(500).send({
          success:false,
          message: "order already delivered",
          error : error.message
        })
      }
      await order.save();
      res.status(200).send({
        success:true,
        message:"order status updated"
      })
    }catch(error){
      // cast error || object id
      if(error.name === "CastError"){
        return res.status(500).send({
          success:false,
          message: "Error in change order status API",
          error : error.message
        })
      }
    }
}

module.exports = {
  createOrderController,
  getAllOrderController,
  getSingleOrderController,
  getAllAdminOrdersController,
  changeOrderStatusController

}
