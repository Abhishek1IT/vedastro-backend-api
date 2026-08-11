import Conversation from "../../models/Conversation.js";
import Message from "../../models/Message.js";

class ChatRepository {
  async findConversation(user1, user2) {
    return await Conversation.findOne({
      participants: { $all: [user1, user2] },
      $expr: {
        $eq: [{ $size: "$participants" }, 2],
      },
    }).populate(
      "participants",
      "_id name role avatar isOnline lastSeen"
    );
  }

  async createConversation(user1, user2) {
    const conversation = await Conversation.create({
      participants: [user1, user2],
    });

    return await Conversation.findById(conversation._id).populate(
      "participants",
      "_id name role avatar isOnline lastSeen"
    );
  }

  async saveMessage(data) {
    return await Message.create(data);
  }

  async getMessages(conversationId) {
    return await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "_id name role avatar")
      .populate("receiver", "_id name role avatar")
      .populate("conversation")
      .sort({ createdAt: 1 });
  }

  async findConversationById(conversationId) {
    return await Conversation.findById(conversationId)
      .populate(
        "participants",
        "_id name role avatar isOnline"
      );
  }

  async updateLastMessage(conversationId, text) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: text,
        lastMessageAt: new Date(),
      },
      {
        new: true,
      },
    ).populate(
      "participants",
      "_id name role avatar isOnline lastSeen"
    );
  }

  async getUserConversations(userId, role) {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate(
        "participants",
        "_id name role phone avatar language experience isOnline isVerified lastSeen"
      )
      .sort({ updatedAt: -1 });

    if (role === "ASTROLOGER") {
      const filteredConversations = [];

      for (const conversation of conversations) {
        const hasIncomingMessage = await Message.exists({
          conversation: conversation._id,
          receiver: userId,
          sender: { $ne: userId },
        });

        if (hasIncomingMessage) {
          filteredConversations.push(conversation);
        }
      }

      return filteredConversations;
    }

    return conversations;
  }
  async markMessageSeen(messageId) {
    return await Message.findByIdAndUpdate(
      messageId,
      {
        isSeen: true,
      },
      {
        returnDocument: "after",
      },
    );
  }

  async deleteMessage(messageId) {
    return await Message.findByIdAndDelete(messageId);
  }

  async getLastMessage(conversationId) {
    return await Message.findOne({
      conversation: conversationId,
    }).sort({ createdAt: -1 });
  }

  async getMessageById(messageId) {
    return await Message.findById(messageId)
      .populate("sender", "_id name role avatar")
      .populate("receiver", "_id name role avatar")
      .populate("conversation");
  }

  async updateMessage(messageId, text) {
    return await Message.findByIdAndUpdate(
      messageId,
      {
        text,
        isEdited: true,
      },
      {
        new: true,
      },
    );
  }
}

export default new ChatRepository();
