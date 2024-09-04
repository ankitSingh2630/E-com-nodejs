const mongoose = require("mongoose");

// review model
const reviewSchema = new mongoose.Schema({
    name :{
        type: String,
        required:[true, "name is require"]
    },
    rating:{
        type:Number,
        default:0
    },
    comment:{
        type:String,
    },
    user:{
        type: String,
        ref:"Users",
        required: [true, "user require"]
    }
}, {timestamps:true})

const productSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true,'product name is required']
    },
    description:{
        type :String,
        required: [true, 'product description is required']
    },
    price:{
        type : Number,
        required:[true, 'product price is required']
    },
    stock:{
        type : Number,
        required: [true, 'product stock required']
    },
    category:{
        // type : mongoose.Schema.Types.ObjectId,
        type: String,
        // ref : 'Category'
        required: [true, 'Product category is required']
    },
    images: [
        {
          public_id: String,
          url: String,
        },
      ],
    reviews:[reviewSchema],
    rating:{
        type:Number,
        default:0
    },
    numReviews:{
        type:Number,
        default:0,
    }
},{timestamps:true});

const productModel = mongoose.model("Products", productSchema);
module.exports = productModel;