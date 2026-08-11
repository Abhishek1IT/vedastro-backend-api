import { Router } from "express";
import AdminController from "./admin.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const adminRouter = Router();

adminRouter.use(authMiddleware);
adminRouter.use(roleMiddleware("ADMIN"));

adminRouter.get("/users", AdminController.getUsers);

adminRouter.get(
  "/astrologers",
  AdminController.getAstrologers,
);

adminRouter.get(
  "/chat-users",
  AdminController.getChatUsers,
);

adminRouter.get(
  "/users/:id",
  AdminController.getUser,
);

adminRouter.get(
  "/chats",
  AdminController.getChats,
);

export default adminRouter;