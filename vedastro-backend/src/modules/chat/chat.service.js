import ChatRepository from "./chat.repository.js";
import ApiError from "../../utils/ApiError.js";

class ChatService {
  async getConversations(userId, role) {
    return await ChatRepository.getUserConversations(
      userId,
      role,
    );
  }

  async getConversationById(conversationId) {
    return await ChatRepository.findConversationById(
      conversationId,
    );
  }

  async createConversation(user1, user2) {
    if (!user1 || !user2) {
      throw new ApiError(400, "Both users are required");
    }

    if (user1 === user2) {
      throw new ApiError(400, "You cannot create a conversation with yourself");
    }

    // conversation already exists
    let conversation = await ChatRepository.findConversation(user1, user2);

    // Create if it doesn't exist
    if (!conversation) {
      conversation = await ChatRepository.createConversation(user1, user2);
    }

    return conversation;
  }

}

export default new ChatService();
