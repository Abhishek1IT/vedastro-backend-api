import { Router } from "express";
import OrderController from "./order.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const orderRouter = Router();

// Authentication required
orderRouter.use(authMiddleware);

// Create Order
orderRouter.post("/", OrderController.createOrder);

// Get Orders by User ID
orderRouter.get("/user/:userId", OrderController.getOrdersByUserId);

// Get Order by ID
orderRouter.get("/:id", OrderController.getOrderById);

// Update Order Status
orderRouter.put("/:id/status", OrderController.updateOrderStatus);

export default orderRouter;