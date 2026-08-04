import { Router } from "express";
import orderController from "./order.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const orderRouter = Router();

// Authentication required
orderRouter.use(authMiddleware);

// Create Order
orderRouter.post("/", orderController.createOrder);

// Get Orders by User ID
orderRouter.get("/user/:userId", orderController.getOrdersByUserId);

// Get Order by ID
orderRouter.get("/:id", orderController.getOrderById);

// Update Order Status
orderRouter.put("/:id/status", orderController.updateOrderStatus);

export default orderRouter;