import ChatService from "./chat.service.js";
import MessageService from "./message.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import { getIO } from "../../config/socket.js";
import ChatRepository from "./chat.repository.js";

class ChatController {
  // Get all conversations
  async getConversations(req, res, next) {
    try {
      const conversations = await ChatService.getConversations(
        req.user.id,
        req.user.role,
      );

      res.status(200).json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single conversation
  async getConversationById(req, res, next) {
    try {
      const { conversationId } = req.params;

      const conversation =
        await ChatService.getConversationById(conversationId);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: conversation,
        message: "Conversation fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Get messages of a conversation
  async getMessages(req, res, next) {

    try {
      const {
        conversationId
      } = req.params;

      const messages =
        await MessageService.getMessages(
          conversationId
        );

      return res.json(
        new ApiResponse(
          200,
          messages,
          "Messages fetched"
        )
      );

    } catch (error) {
      next(error);
    }
  }

  // Create conversation
  async createConversation(req, res, next) {
    try {
      const { receiverId } = req.body;

      const conversation = await ChatService.createConversation(
        req.user.id,
        receiverId,
      );

      res.status(201).json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }

  // Send Message 
  async sendMessage(req, res, next) {
    try {
      const { receiverId, text, replyTo } = req.body;

      const message = await MessageService.sendMessage({
        senderId: req.user.id,
        receiverId,
        text,
        replyTo,
      });

      const io = req.app.get("io");

      const conversationId =
        message.conversation && message.conversation._id
          ? message.conversation._id.toString()
          : message.conversation?.toString();

      io.to(`conversation:${conversationId}`).emit("message:new", message);

      res.status(201).json({
        success: true,
        data: message,
      });

    } catch (error) {
      next(error);
    }
  }
  // Mark Seen
  async markMessageSeen(req, res, next) {
    try {
      const { messageId } = req.params;

      const message = await MessageService.markMessageSeen(messageId);

      res.status(200).json({
        success: true,
        message: "Message marked as seen",
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete Message
  async deleteMessage(req, res, next) {
    try {
      const { messageId } = req.params;

      const result = await MessageService.deleteMessage(messageId, req.user.id);

      res.status(200).json({
        success: true,
        message: "Message deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Edit Message
  async updateMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      const { text } = req.body;

      const message = await MessageService.updateMessage(
        messageId,
        req.user.id,
        text,
      );

      res.status(200).json({
        success: true,
        message: "Message updated successfully",
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }
}


export default new ChatController();
