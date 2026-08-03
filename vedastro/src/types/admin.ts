export interface AdminUser {
  _id: string;
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  role: "USER" | "ASTROLOGER" | "ADMIN" | string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  language?: string;
  experience?: number;
  profileCompleted?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminConversationParticipant {
  _id: string;
  name?: string;
  role?: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface AdminConversation {
  _id: string;
  participants: AdminConversationParticipant[];
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt?: string;
  updatedAt?: string;
}