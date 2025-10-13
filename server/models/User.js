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
    bio:{
        type:String,
        default:""
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'host', 'admin'],
        default: 'user'
    },
    isHost: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
},{
    timestamps:true
})

const User=mongoose.model("User",userSchema)
export default User