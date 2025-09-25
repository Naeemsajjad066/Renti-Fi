import express from "express";
import { checkAuth, login, Signup, updateProfile, verifyEmail, resendVerificationCode } from "../controllers/userController.js";
import { protectRoute } from "../controllers/auth.js";


const userRouter=express.Router();


userRouter.post("/signup",Signup)
userRouter.post("/verify-email", verifyEmail)
userRouter.post("/resend-verification", resendVerificationCode)
userRouter.post("/login",login)
userRouter.put("/update-profile",protectRoute,updateProfile)
userRouter.get("/check",protectRoute,checkAuth)


export default userRouter;