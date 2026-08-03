import { Router } from "express";

import AdminController from "./admin.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { ROLES } from "../../common/roles.js";

const adminRouter = Router();

adminRouter.use(authMiddleware);
adminRouter.use(roleMiddleware("ADMIN"));

adminRouter.get(
  "/users",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  AdminController.getUsers,
);

adminRouter.get("/astrologers", authMiddleware, roleMiddleware(ROLES.ADMIN), AdminController.getAstrologers);

adminRouter.get("/chat-users", authMiddleware, roleMiddleware(ROLES.ADMIN), AdminController.getChatUsers);

adminRouter.get("/users/:id", authMiddleware, roleMiddleware(ROLES.ADMIN), AdminController.getUser);

adminRouter.get("/chats", authMiddleware, roleMiddleware(ROLES.ADMIN), AdminController.getChats);

export default adminRouter;
