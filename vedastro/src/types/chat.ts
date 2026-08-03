export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export interface IMessage {
  id: string;
  roomId: string;
  senderId: string;
  text: string;
  timestamp: string;
  status?: MessageStatus;
}

export interface IChatRoom {
  roomId: string;
  astrologerId: string;
  userId: string;
  astrologerName: string;
  userName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface ITypingPayload {
  typingRoomId: string;
  userId: string;
}