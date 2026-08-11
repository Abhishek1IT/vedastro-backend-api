import ChatRepository from "./chat.repository.js";
import ApiError from "../../utils/ApiError.js";

class MessageService {
  async sendMessage({ senderId, receiverId, text, replyTo = null }) {
    let conversation = await ChatRepository.findConversation(
      senderId,
      receiverId,
    );

    if (!conversation) {
      conversation = await ChatRepository.createConversation(
        senderId,
        receiverId,
      );
    }

    const message = await ChatRepository.saveMessage({
      conversation: conversation._id,
      sender: senderId,
      receiver: receiverId,
      text,
      replyTo,
    });

    await ChatRepository.updateLastMessage(
      conversation._id,
      text,
    );

    return await ChatRepository.getMessageById(message._id);
  }

  async getMessages(conversationId) {
    return await ChatRepository.getMessages(conversationId);
  }

  async markMessageSeen(messageId) {
    return await ChatRepository.markMessageSeen(messageId);
  }

  async deleteMessage(messageId, userId) {
    const message = await ChatRepository.getMessageById(messageId);

    if (!message) {
      throw new ApiError(404, "Message not found");
    }

    if (message.sender._id.toString() !== userId) {
      throw new ApiError(403, "You can only delete your own message");
    }

    await ChatRepository.deleteMessage(messageId);

    const lastMessage = await ChatRepository.getLastMessage(
      message.conversation,
    );

    await ChatRepository.updateLastMessage(
      message.conversation,
      lastMessage ? lastMessage.text : "",
    );

    return {
      messageId,
    };
  }

  async updateMessage(messageId, userId, text) {
    const message = await ChatRepository.getMessageById(messageId);

    if (!message) {
      throw new ApiError(404, "Message not found");
    }

    if (message.sender._id.toString() !== userId) {
      throw new ApiError(403, "You can only edit your own message");
    }

    const updated = await ChatRepository.updateMessage(messageId, text);

    const lastMessage = await ChatRepository.getLastMessage(
      message.conversation,
    );

    if (lastMessage && lastMessage._id.toString() === messageId) {
      await ChatRepository.updateLastMessage(message.conversation, text);
    }

    return updated;
  }

  async canSendMessage(senderId, receiverId) {
    return true;
  }

  async hasConversationAccess(conversationId, userId) {
    const conversation =
      await ChatRepository.findConversationById(conversationId);

    if (!conversation) {
      return false;
    }

    const hasAccess = conversation.participants.some(
      (p) => String(p._id || p) === String(userId)
    );

    return hasAccess;
  }
}

export default new MessageService();
