const { response } = require("express");
const categoryModel = require("../models/categoryModel.js");
const productModel = require("../models/productModel.js");

// create category
const createCategoryController  = async(req,res)=>{
    try{
        const {category} = req.body
        // validation
        if(!category){
            return res.status(404).send({
                sucees:false,
                message :"please provide category name"
            })
        }
        const newCategory = await categoryModel.create({category})
        res.status(201).send({
            success:true,
            message : `${category} category created successfully`,
            category :newCategory

        })
    }catch(error){
        console.log(error);;
        res.status(500).send({
            success:false,
            message: error.message
        })
    }
}




// get all category
const getAllCategoryController = async(req,res)=>{
    try{
        const categories = await categoryModel.find({})
        res.status(200).send({
            success:true,
            message: "categories fetch successfully",
            totalcat : categories.length,
            categories,
        })
    }
catch(error){
    console.log(error);;
    res.status(500).send({
        success:false,
        message:"get error in get all category api"
    })
}
}
// delete category by id
const deleteIdController =async(req,res)=>{
    try{
        const category = await categoryModel.findById(req.params.id)
        // validation
        if(!category){
            return res.status(404).send({
                success : false,
                message : "category not found"
            })
        }
        // find product with this category id
        const products = await productModel.find({category:category._id})
        // upate product category

        for(let i = 0; i<products; length, i++){
            const product = product[i]
            product.category = undefined
            await product.save()
        }
        // save
        await category.deleteOne()
        res.status(200).send({
            success:true,
            message : "category deleted successfully",
        })
    }catch(error){
    console.log(error);;
    res.status(500).send({
        success:false,
        message:"get error in delete category api"
    })
}
}

// delete all category
const deleteAllCategoryController = async(req,res)=>{
    try{
        const result = await categoryModel.deleteMany({});
        res.status(200).send({
            success:true,
            message: "all categories deleted successfully",
            deletedCount : result.deletedCount,
        });
    }catch(error){
    console.log(error);;
    res.status(500).send({
        success:false,
        message:"get error in delete all category api"
    })
}
}

const updateCategoryController = async(req,res)=>{
    try{
        const category = await categoryModel.findById(req.params.id)
        // validation
        if(!category){
            return res.status(404).send({
                success : false,
                message : "category not found"
            })
        }
        // get new cat
        const {updatedCategory} = req.body;
        // Validation
        if (!updatedCategory) {
            return res.status(400).send({
                success: false,
                message: "Please provide a new category name"
            });
        }
        // find product with this category id
        const products = await productModel.find({category:category._id})
        // Update each product with the new category name

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            product.category = updatedCategory;
            await product.save();
        }
        // Update category name
        category.category = updatedCategory;
        await category.save();
        res.status(200).send({
            success:true,
            message : "category updated successfully",
        })
    }catch(error){
    console.log(error);
    if(error.name === "CastError"){
        return res.status(500).send({
            success : false,
            message : "Invalid Id"
        });
    }
    res.status(500).send({
        success:false,
        message:"error in update category api",
        error: error.message
    })
}
}

module.exports = {
    createCategoryController,
    getAllCategoryController,
    deleteAllCategoryController,
    deleteIdController,
    updateCategoryController,



}