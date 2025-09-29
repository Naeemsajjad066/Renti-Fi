import express from "express";
import { checkAuth, login, Signup, updateProfile, verifyEmail, resendVerificationCode, forgotPassword, resetPassword, getUserById } from "../controllers/userController.js";
import { protectRoute } from "../controllers/auth.js";


const userRouter=express.Router();


userRouter.post("/signup",Signup)
userRouter.post("/verify-email", verifyEmail)
userRouter.post("/resend-verification", resendVerificationCode)
userRouter.post("/login",login)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/reset-password", resetPassword)
userRouter.get("/profile", protectRoute, checkAuth)
userRouter.put("/update-profile",protectRoute,updateProfile)
userRouter.get("/check",protectRoute,checkAuth)
userRouter.get("/user/:userId", protectRoute, getUserById)


export default userRouter;