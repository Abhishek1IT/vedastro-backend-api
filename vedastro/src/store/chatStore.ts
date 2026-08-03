import { create } from "zustand";

export interface Message {
  _id: string;
  conversation: string;

  sender:
    | string
    | {
        _id: string;
        name?: string;
        role?: string;
        avatar?: string;
      };

  receiver:
    | string
    | {
        _id: string;
        name?: string;
        role?: string;
        avatar?: string;
      };

  text: string;
  isSeen?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Contact {
  _id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

interface ChatState {
  activeRoomId: string | null;

  messagesByRoom: Record<string, Message[]>;

  activeContacts: Contact[];

  onlineUsers: Record<string, boolean>;

  setActiveRoom: (roomId: string | null) => void;

  setMessages: (roomId: string, messages: Message[]) => void;

  addMessage: (roomId: string, message: Message) => void;

  deleteMessage: (roomId: string, messageId: string) => void;

  clearMessages: (roomId: string) => void;

  setActiveContacts: (contacts: Contact[]) => void;

  // Online status actions
  setUserOnline: (userId: string) => void;

  setUserOffline: (userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeRoomId: null,

  messagesByRoom: {},

  activeContacts: [],

  onlineUsers: {},

  setActiveRoom: (roomId) =>
    set({
      activeRoomId: roomId,
    }),

  setMessages: (roomId, messages) =>
    set((state) => ({
      messagesByRoom: {
        ...state.messagesByRoom,
        [roomId]: messages,
      },
    })),

  addMessage: (roomId, message) =>
    set((state) => {
      const current = state.messagesByRoom[roomId] || [];

      if (current.some((m) => m._id === message._id)) {
        return state;
      }

      return {
        messagesByRoom: {
          ...state.messagesByRoom,
          [roomId]: [...current, message],
        },
      };
    }),

  deleteMessage: (roomId, messageId) =>
    set((state) => ({
      messagesByRoom: {
        ...state.messagesByRoom,
        [roomId]: (state.messagesByRoom[roomId] || []).filter(
          (m) => m._id !== messageId,
        ),
      },
    })),

  clearMessages: (roomId) =>
    set((state) => ({
      messagesByRoom: {
        ...state.messagesByRoom,
        [roomId]: [],
      },
    })),

  setActiveContacts: (contacts) =>
    set({
      activeContacts: contacts,
    }),

  // User Online
  setUserOnline: (userId) =>
    set((state) => ({
      onlineUsers: {
        ...state.onlineUsers,
        [userId]: true,
      },
    })),

  // User Offline
  setUserOffline: (userId) =>
    set((state) => ({
      onlineUsers: {
        ...state.onlineUsers,
        [userId]: false,
      },
    })),

  clearOnlineUsers: () =>
    set({
      onlineUsers: {},
    }),
}));
