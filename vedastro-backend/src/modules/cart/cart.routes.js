import { Router } from "express";

import cartController from "./cart.controller.js";
import{
    addToCartSchema,
    updateQuantitySchema,
} from "./cart.validation.js"
import validate from "../../middlewares/validate.middleware.js"
import authMiddleware from "../../middlewares/auth.middleware.js";

const cartRouter = Router();

// Add Product
cartRouter.post(
    "/",
    authMiddleware,
    validate(addToCartSchema),
    cartController.addToCart
);

// Get Cart
cartRouter.get(
    "/",
    authMiddleware,
    cartController.getCart
);

// Update Quantity
cartRouter.put(
    "/:productId",
    authMiddleware,
    validate(updateQuantitySchema),
    cartController.updateQuantity
);

// Remove Item
cartRouter.delete(
    "/:productId",
    authMiddleware,
    cartController.removeItem
);

//Clear Cart
cartRouter.delete(
    "/",
    authMiddleware,
    cartController.clearCart
);

export default cartRouter