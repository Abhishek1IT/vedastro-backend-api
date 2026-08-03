import { Router } from "express";

import UserController from "./user.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/me", authMiddleware, UserController.getProfile);

userRouter.get("/astrologers", UserController.getAstrologersProfile,);

userRouter.patch("/status", authMiddleware, UserController.updateStatus);

userRouter.put("/me", authMiddleware, UserController.updateProfile);

userRouter.put("/me/password", authMiddleware, UserController.changePassword);

userRouter.delete("/me", authMiddleware, UserController.deleteAccount);

userRouter.get("/chat-users", authMiddleware, UserController.getChatUsers);

export default userRouter;
