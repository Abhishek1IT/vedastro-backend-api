import express from "express";

import authRouter from "../modules/auth/auth.routes.js";
import userRouter from "../modules/user/user.routes.js";
import chatRouter from "../modules/chat/chat.routes.js";
import adminRouter from "../modules/admin/admin.routes.js";
import callRouter from "../modules/call/call.routes.js";
import productRouter from "../modules/product/product.routes.js";
import cartRouter from "../modules/cart/cart.routes.js";
import orderRouter from "../modules/order/order.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/call", callRouter);
router.use("/chat", chatRouter);
router.use("/admin", adminRouter);
router.use("/product", productRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);

export default router;
