const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: [true, "City name is required"]
        },
        country: {
            type: String,
            required: [true, "Country name is required"]
        }
    },
    orderItems: [{
        name: {
            type: String,
            required: [true, "Product name is required"]
        },
        price: {
            type: String,
            required: [true, "Price is required"]
        },
        quantity: {
            type: Number,  // Assuming quantity is a numerical value
            required: [true, "Quantity is required"]
        },
        image: {
            type: String,
            required: [true, "Product image is required"]
        },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Products',
            required : true,
        }
    }],
    paymentMethod :{
        type : String,
        enum : ["COD", "ONLINE"],
        default: "COD"
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required : [true, "iuser id is required"]
    },
    paidAt : Date,
    paymentInfo : {
        id: String,
        status :String
    },
    itemPrice : {
        type:Number,
        required : [true, "item price is required"]
    },tax : {
        type:Number,
        required : [true, "tax price is required"]
    },
    shippingCharges : {
        type:Number,
        required : [true, "shipping price is required"]
    },
    totalAmount : {
        type:Number,
        required : [true, " totalAmount is required"]
    },
    orderStatus : {
        type:String,
        enum: ['processing', 'shipped', 'delivered',],
        default: "processing"
    },
    deliveredAt :Date
    
}, { timestamps: true });

const orderModel = mongoose.model("order", OrderSchema);
module.exports = orderModel;