import { Router } from "express";
import AdminController from "./admin.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const adminRouter = Router();

// Only logged-in ADMIN can access these routes
adminRouter.use(authMiddleware);
adminRouter.use(roleMiddleware("ADMIN"));

// Users
adminRouter.get("/users", AdminController.getUsers);

adminRouter.get("/users/:id", AdminController.getUser);

// Astrologers
adminRouter.get(
  "/astrologers",
  AdminController.getAstrologers,
);

adminRouter.get(
  "/astrologers/pending",
  AdminController.getPendingAstrologers,
);

adminRouter.get(
  "/astrologers/:id",
  AdminController.getAstrologer,
);

adminRouter.patch(
  "/astrologers/:id/approve",
  AdminController.approveAstrologer,
);

adminRouter.patch(
  "/astrologers/:id/reject",
  AdminController.rejectAstrologer,
);

// Chats
adminRouter.get(
  "/chat-users",
  AdminController.getChatUsers,
);

adminRouter.get(
  "/chats",
  AdminController.getChats,
);

export default adminRouter;