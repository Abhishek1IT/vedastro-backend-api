import { Router } from "express";

import ProductController from "./product.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { ROLES } from "../../common/roles.js";
import upload from "../../middlewares/upload.middleware.js";

const productRouter = Router();

/* Public Routes */

// Get all products
productRouter.get(
    "/",
    ProductController.getProducts
);

// Get single product
productRouter.get(
    "/:id",
    ProductController.getProduct
);

// Search
productRouter.get(
    "/search/:keyword",
    ProductController.search
);

/* Admin Routes */

productRouter.post(
    "/",
    authMiddleware,
    roleMiddleware(ROLES.ADMIN),
    upload.array("images", 5),
    ProductController.create
);

productRouter.put(
    "/:id",
    authMiddleware,
    roleMiddleware(ROLES.ADMIN),
    upload.array("images", 5),
    ProductController.updateProduct
);

productRouter.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(ROLES.ADMIN),
    ProductController.deleteProduct
);

export default productRouter;