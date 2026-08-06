import api from "../lib/axios";

export const consultationService = {
  // Public
  async getAstrologers() {
    try {
      const { data } = await api.get("/user/astrologers");
      return data?.data || data || [];
    } catch (error) {
      console.error("Error fetching astrologers:", error);
      return [];
    }
  },

  // Protected
  async getChatUsers() {
    try {
      const { data } = await api.get("/user/chat-users");
      return data?.data || data || [];
    } catch (error) {
      console.error("Error fetching chat users:", error);
      return [];
    }
  },
};
