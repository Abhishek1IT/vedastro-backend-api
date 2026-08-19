import { Router } from "express";
import AuthController from "./auth.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  sendOtpSchema,
  verifyOtpSchema,
  registerSchema,
} from "./auth.validation.js";

const authRouter = Router();

// Register User
authRouter.post(
  "/register",
  validate(registerSchema),
  AuthController.register,
);

// Send OTP
authRouter.post(
  "/send-otp",
  validate(sendOtpSchema),
  AuthController.sendOtp,
);

// Verify OTP
authRouter.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  AuthController.verifyOtp,
);

// Complete Profile
authRouter.put(
  "/completeprofile",
  authMiddleware,
  AuthController.completeProfile,
);

// Login User
// authRouter.post(
//   "/login",
//   validate(loginSchema),
//   AuthController.login,
// );

// Current User
authRouter.get("/me", authMiddleware, AuthController.me);

// Logout
authRouter.post("/logout", AuthController.logout);

// Refresh Token
authRouter.post(
  "/refresh-token",
  AuthController.refreshToken,
);

export default authRouter;
