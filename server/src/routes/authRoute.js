import express from "express";
import { register, login, logout, sendVerifyOtp, verifyEmail, sendResetOtp, resetPassword, verifyResetOtp } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp",sendVerifyOtp)
authRouter.post("/verify-account",verifyEmail)
//authRouter.post("/is-auth",userAuth,isAuthenticated)
authRouter.post("/send-reset-otp",sendResetOtp)
authRouter.post("/verify-reset-otp",verifyResetOtp)
authRouter.post("/reset-password",userAuth,resetPassword)