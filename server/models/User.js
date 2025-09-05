import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true 
    },idCard:{
        type:Number,
        required:true,
        unique:true
    }, 
     phoneNumber: 
     { type: String, required: true },  // ✅ new field

    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6  
    },
    profilePic:{
        type:String,
        default:""
    },
},{
    timestamps:true
})

const User=mongoose.model("User",userSchema)
export default User