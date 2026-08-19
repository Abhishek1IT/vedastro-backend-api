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

  async getPendingAstrologers(): Promise<AdminUser[]> {
    const response = await api.get(API_ENDPOINTS.ADMIN.PENDING_ASTROLOGERS);

    return response.data.data || [];
  },

  async getAstrologer(id: string): Promise<AdminUser | null> {
    const response = await api.get(API_ENDPOINTS.ADMIN.ASTROLOGER_DETAILS(id));

    return response.data.data || null;
  },

  async approveAstrologer(id: string): Promise<AdminUser | null> {
    const response = await api.patch(
      API_ENDPOINTS.ADMIN.APPROVE_ASTROLOGER(id),
      {
        approvalStatus: "APPROVED",
      },
    );

    return response.data.data || null;
  },

  async rejectAstrologer(
    id: string,
    rejectionReason: string,
  ): Promise<AdminUser | null> {
    const response = await api.patch(
      API_ENDPOINTS.ADMIN.REJECT_ASTROLOGER(id),
      {
        rejectionReason,
      },
    );

    return response.data.data || null;
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
