/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../lib/axios";

export const consultationService = {
  async getTopAstrologers() {
    try {
      const response = await api.get("/user/astrologers");
      
      if (Array.isArray(response.data)) {
        return response.data
          .filter((astro: any) => astro.rating >= 4.5)
          .slice(0, 3);
      }
      return [];
    } catch (error) {
      console.error("404 Error bypassed. Returning safe fallback array:", error);
      return [];
    }
  },
};