import { Router } from "express";
import CallController from "./call.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const CallRouter = Router();

CallRouter.get(
  "/history",
  authMiddleware,
  CallController.history
);

export default CallRouter;