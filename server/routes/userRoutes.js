import express from "express";
import { checkAuth, login, Signup, updateProfile, verifyEmail, resendVerificationCode, forgotPassword, resetPassword, getUserById, getPublicUserById } from "../controllers/userController.js";
import { protectRoute } from "../controllers/auth.js";
import { authLimiter, passwordResetLimiter, verificationCodeLimiter } from "../middleware/rateLimiter.js";


const userRouter=express.Router();


userRouter.post("/signup", authLimiter, Signup)
userRouter.post("/verify-email", verificationCodeLimiter, verifyEmail)
userRouter.post("/resend-verification", verificationCodeLimiter, resendVerificationCode)
userRouter.post("/login", authLimiter, login)
userRouter.post("/forgot-password", passwordResetLimiter, forgotPassword)
userRouter.post("/reset-password", passwordResetLimiter, resetPassword)
userRouter.get("/public/:userId", getPublicUserById)
userRouter.get("/profile", protectRoute, checkAuth)
userRouter.put("/update-profile", protectRoute, updateProfile)
userRouter.get("/check", protectRoute, checkAuth)
userRouter.get("/user/:userId", protectRoute, getUserById)


export default userRouter;