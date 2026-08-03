import api from "../lib/axios";
import { API_ENDPOINTS } from "../constants/api";
import type { AdminConversation, AdminUser } from "../types/admin";

const adminService = {
  async getUsers(): Promise<AdminUser[]> {
    const response = await api.get(API_ENDPOINTS.ADMIN.USERS);
    return response.data.data || [];
  },

  async getAstrologers(): Promise<AdminUser[]> {
    const response = await api.get(API_ENDPOINTS.ADMIN.ASTROLOGERS);
    return response.data.data || [];
  },

  async getChatUsers(): Promise<AdminUser[]> {
    const response = await api.get(API_ENDPOINTS.ADMIN.CHAT_USERS);
    return response.data.data || [];
  },

  async getUser(id: string): Promise<AdminUser | null> {
    const response = await api.get(API_ENDPOINTS.ADMIN.USER_DETAILS(id));
    return response.data.data || null;
  },

  async getChats(): Promise<AdminConversation[]> {
    const response = await api.get(API_ENDPOINTS.ADMIN.CHATS);
    return response.data.data || [];
  },
};

export default adminService;