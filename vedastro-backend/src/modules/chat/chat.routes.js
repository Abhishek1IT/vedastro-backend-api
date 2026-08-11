import { Router } from "express";

import ChatController from "./chat.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { ROLES } from "../../common/roles.js";

const chatRouter = Router();

chatRouter.use(authMiddleware);

// Get conversations
chatRouter.get(
  "/conversations",
  roleMiddleware(
    ROLES.ADMIN,
    ROLES.ASTROLOGER,
    ROLES.USER
  ),
  ChatController.getConversations
);

chatRouter.get(
  "/conversations/:conversationId",
  roleMiddleware(
    ROLES.ADMIN,
    ROLES.ASTROLOGER,
    ROLES.USER
  ),
  ChatController.getConversationById
);

// Get messages
chatRouter.get(
  "/messages/:conversationId",
  ChatController.getMessages
);

// Create conversation
chatRouter.post(
  "/conversations",
  ChatController.createConversation
);

// Send message
chatRouter.post(
  "/send",
  ChatController.sendMessage
);

// Seen
chatRouter.put(
  "/message/seen/:messageId",
  ChatController.markMessageSeen
);

// Delete
chatRouter.delete(
  "/message/:messageId",
  ChatController.deleteMessage
);

// Update
chatRouter.put(
  "/message/:messageId",
  ChatController.updateMessage
);

export default chatRouter;