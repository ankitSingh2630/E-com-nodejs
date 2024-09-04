const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,'name is required']
    },
    email:{
        type: String,
        required:[true, 'email is required'],
        unique:[true, 'email already taken']
    },
    password:{
        type: String,
        required:[true,'password is required'],
        minilength:[6,'password length is greater than 6 character']
    },
    address:{
        type:String,
        require:[true, 'adress is required'],
    },
    city:{
        type:String,
        required:[true,'city name is required']
    },
    country:{
        type: String,
        required: [true,'country name is required']
    },
    phone:{
        type:String,
        required:[true,'phone no is required']
    },
    profilePic:{
        public_id : {
            type : String,
        },
        url : {
            type : String,
        }
    },
    answer:{
        type:String,
        required:[true, "answer is required"]
    },
    role:{
        type: String,
        default: 'user',
    }
},{timestamps:true});

// for hash

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
  // Only hash the password if it's been modified
    
    this.password = await bcrypt.hash(this.password,10);
    next()
})
// compare function
userSchema.methods.comparePassword = async function(plainPassword){
    return await bcrypt.compare(plainPassword, this.password)
}

// jwt token
userSchema.methods.generateToken = function(){
    return JWT.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '6d'})
}

const User = mongoose.model("Users", userSchema);
module.exports =  User;

