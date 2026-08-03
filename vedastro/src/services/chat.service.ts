import api from "@/src/lib/axios";

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: string;
  receiver: string;
  text: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Conversation
 */
export const createConversation = async (
  receiverId: string,
): Promise<Conversation> => {
  const { data } = await api.post("/chat/conversations", {
    receiverId,
  });

  return data.data;
};

/**
 * Get All Conversations
 */
export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get("/chat/conversations");

  return data.data;
};

/**
 * Get Messages
 */
export const getMessages = async (
  conversationId: string,
): Promise<Message[]> => {
  const { data } = await api.get(`/chat/messages/${conversationId}`);

  return data.data;
};

/**
 * Send Message
 */
export const sendMessage = async (
  receiverId: string,
  text: string,
): Promise<Message> => {
  const { data } = await api.post("/chat/send", {
    receiverId,
    text,
  });

  return data.data;
};

/**
 * Mark Message as Seen
 */
export const markMessageSeen = async (messageId: string): Promise<Message> => {
  const { data } = await api.put(`/chat/message/seen/${messageId}`);

  return data.data;
};
