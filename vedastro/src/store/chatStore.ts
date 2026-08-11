import { create } from "zustand";

export interface ChatMessage {
  _id?: string;
  text: string;
  sender: string | { _id: string };
  receiver?: string | { _id: string };
  conversation: string | { _id: string };
  createdAt?: string;
  status?: "sending" | "sent" | "failed";
}

interface ChatState {
  messagesByRoom: Record<string, ChatMessage[]>;
  onlineUsers: Record<string, boolean>;

  setMessages: (roomId: string, messages: ChatMessage[]) => void;

  addMessage: (roomId: string, message: ChatMessage) => void;

  replaceMessage: (
    roomId: string,
    tempId: string,
    message: ChatMessage,
  ) => void;

  updateMessageStatus: (
    roomId: string,
    messageId: string,
    status: ChatMessage["status"],
  ) => void;

  setUserOnline: (userId: string, isOnline: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messagesByRoom: {},
  onlineUsers: {},

  setMessages: (roomId, messages) => {
    set((state) => {
      const uniqueMessages = messages.filter(
        (message, index, array) =>
          !message._id ||
          array.findIndex((item) => item._id === message._id) === index,
      );

      return {
        messagesByRoom: {
          ...state.messagesByRoom,
          [roomId]: uniqueMessages,
        },
      };
    });
  },

  addMessage: (roomId, message) =>
    set((state) => {
      const existingMessages = state.messagesByRoom[roomId] || [];

      if (
        message._id &&
        existingMessages.some(
          (item) => String(item._id) === String(message._id),
        )
      ) {
        return state;
      }

      return {
        messagesByRoom: {
          ...state.messagesByRoom,
          [roomId]: [...existingMessages, message],
        },
      };
    }),

  replaceMessage: (roomId, tempId, message) => {
    set((state) => {
      const currentMessages = state.messagesByRoom[roomId] || [];

      return {
        messagesByRoom: {
          ...state.messagesByRoom,
          [roomId]: currentMessages.map((item) =>
            String(item._id) === String(tempId)
              ? {
                  ...message,
                  status: "sent",
                }
              : item,
          ),
        },
      };
    });
  },

  updateMessageStatus: (roomId, messageId, status) => {
    set((state) => {
      const currentMessages = state.messagesByRoom[roomId] || [];

      return {
        messagesByRoom: {
          ...state.messagesByRoom,
          [roomId]: currentMessages.map((item) =>
            String(item._id) === String(messageId)
              ? {
                  ...item,
                  status,
                }
              : item,
          ),
        },
      };
    });
  },

  setUserOnline: (userId, isOnline) => {
    set((state) => ({
      onlineUsers: {
        ...state.onlineUsers,
        [String(userId)]: isOnline,
      },
    }));
  },
}));
