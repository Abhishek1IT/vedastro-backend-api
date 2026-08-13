/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../lib/axios";

export const consultationService = {
  async getAstrologers() {
    try {
      const response = await api.get("/user/astrologers");

      console.log("ASTROLOGERS API RESPONSE:", response.data);

      if (Array.isArray(response.data?.data)) {
        return response.data.data;
      }

      return [];
    } catch (error: any) {
      console.error(
        "ASTROLOGERS API ERROR:",
        error?.response?.status,
        error?.response?.data || error?.message || error
      );

      return [];
    }
  },

  async getChatUsers() {
    try {
      const { data } = await api.get("/user/chat-users");
      return Array.isArray(data?.data) ? data.data : [];
    } catch (error: any) {
      console.error(
        "CHAT USERS ERROR:",
        error?.response?.data || error
      );
      return [];
    }
  },
};