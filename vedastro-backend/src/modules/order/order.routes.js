import { Router } from "express";
import orderController from "./order.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { ROLES } from "../../common/roles.js";

const orderRouter = Router();

orderRouter.use(authMiddleware);

// User
orderRouter.post("/", orderController.createOrder);
orderRouter.get("/", orderController.getOrdersByUserId);
orderRouter.get("/:id", orderController.getOrderById);

// User Cancel Order
orderRouter.patch("/:id/cancel", orderController.cancelOrder);

// Admin
orderRouter.put(
    "/:id/status",
    roleMiddleware(ROLES.ADMIN),
    orderController.updateOrderStatus
);

export default orderRouter;