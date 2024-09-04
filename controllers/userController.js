const userModel = require('../models/userModel')
const { getDataUri } = require('../utils/features');
const cloudinary = require("cloudinary").v2;
const registerController =async (req,res)=>{
    try{
        const {name,email,password,address,city,country,phone, answer}=req.body;
        // validation
        if(!name || !email || !password || !city || !address || !country  || !phone || !answer ){
            return res.status(500).send({
                success : false,
                message : "please provide all fields",
            })
        }
        // check exisiting user
        const exisitingUser = await userModel.findOne({email});
        // validation
        if(exisitingUser){
            return res.status(500).send({
                success:false,
                message: "email already taken",
            });
        }
        const user = await userModel.create({
            name,
            email,
            password,
            city,
            address,
            country,
            phone,
            answer,
            // profilePic
        });
        res.status(201).send({
            success:true,
            message:"registratoin Success, Please login",
            user
        })
    }catch(error){
        console.error("error", error);
        res.status(500).send({
            success:false,
            message: "error in register api",
            error: error.message,
        })
    }

};

// login
 const loginController = async(req,res)=>{
    try{
        const {email,password}= req.body
        // validation
        if(!email || !password){
            return res.status(500).send({
                success:"false",
                message:"please add email or password"
            })
        }
        // check user
        const user = await userModel.findOne({email})
        // user validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'user not found'
            })
        }
        // check pass
        const isMatch = await user.comparePassword(password)

        // validation pass
        if(!isMatch){
            return res.status(401).send({
                success:false,
                message:"invalid credentials"
            })
        }
        // token
        const token = user.generateToken();
        res.status(200)
        .cookie("token", token,{    
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),  
            secure: process.env.NODE_ENV !== "development",
                httpOnly: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV !== "development",
        })
        .send({
            success:true,
            message: "Login Successfully",
            token,
            user,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:"false",
            message:"error in login Api",
            error:error.message,
        })
    }
}

// get user profile
const getUserProfileController = async(req,res)=>{
    try{
        const user = await userModel.findById(req.user._id);
        res.status(200).send({
            success:true,
            message:'User profile fetched successfully',
            user
        })
    }catch(error){
        console.error(error);
        res.status(500).send({
            success: false,
            message : "error in profile api",
            error
        })
    }

}

// logout
const logOutController = async(req,res)=>{
    try{
        res.status(200).cookie("token", "", {    
            expires: new Date(Date.now()),  
            // secure: process.env.NODE_ENV === "development" ? true : false,
            // httpOnly: process.env.NODE_ENV === "development" ? true : false,
            // sameSite: process.env.NODE_ENV === "development" ? true : false
            secure: process.env.NODE_ENV !== "development",
                httpOnly: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV !== "development",
        }).send({
            success: true,
            message: "logout successfully"
        })
    }catch(error){
        console.error(error);
        res.status(500).send({
            success: false,
            message : "error in logout api",
            error
        })
    }
};

// update user profile
const updateProfileController = async(req,res)=>{
    try{
        const user = await userModel.findById(req.user._id)
        const{name,email,address,city,country,phone} = req.body
        // validation + update
        if(name) user.name = name
        if(email) user.email = email
        if(address) user.address = address
        if(city) user.city = city
        if(country) user.country = country
        if(phone) user.phone = phone
        // save user
        await user.save()
        res.status(200).send({
            success: true,
            message: "user profile updated"
        })
    }catch(error){
        console.error(error);
        res.status(500).send({
            success: false,
            message : "error in logout api",
            error
        })
    }
}

// update user passsword
const updatePasswordController = async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id);
      const { oldPassword, newPassword } = req.body;
      //valdiation
      if (!oldPassword || !newPassword) {
        return res.status(500).send({
          success: false,
          message: "Please provide old or new password",
        });
      }
      // old pass check
      const isMatch = await user.comparePassword(oldPassword);
      //validaytion
      if (!isMatch) {
        return res.status(500).send({
          success: false,
          message: "Invalid Old Password",
        });
      }
      user.password = newPassword;
      await user.save();
      res.status(200).send({
        success: true,
        message: "Password Updated Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In update password API",
        error,
      });
    }
  };

/// Update user profile photo
const updateProfilePicController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const file = getDataUri(req.file);
        const user = await userModel.findById(req.user.id);

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete the previous profile picture if it exists
        if (user.profilePic && user.profilePic.public_id) {
            await cloudinary.uploader.destroy(user.profilePic.public_id);
        }

        // Upload new profile picture
        const result = await cloudinary.uploader.upload(file.content, {
            folder: 'profile_pics'
        });

        // Update the user's profile picture URL and public_id
        user.profilePic = {
            url: result.secure_url,
            public_id: result.public_id
        };
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            url: result.secure_url
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile picture',
            error: error.message
        });
    }
};

// forgot password
const passwordResetController = async(req,res)=>{
    try{
        // user get email || new password || answer
        const {email, newPassword,answer} = req.body
        // validation
        if(!email || !newPassword || !answer){
             return res.status(500).send({
                success:false,
                message:"Please provide All fields",
                error : error.message
             })
        }
        // find user
        const user = await userModel.findOne({email,answer})
        // validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:"invalid user or answer",
                error:error.message
            })
        }
        // change password
        user.password = newPassword
        await user.save()
        res.status(200).send({
            success:true,
            message: "your password has been reset please login again"
        })
    }catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile picture',
            error: error.message
        });
    }
}

module.exports = {
    registerController,
    loginController,
    getUserProfileController,
    logOutController,
    updateProfileController,
    updatePasswordController,
    updateProfilePicController,
    passwordResetController,
};


