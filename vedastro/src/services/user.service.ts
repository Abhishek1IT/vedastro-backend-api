import api from "../lib/axios";
import { API_ENDPOINTS } from "../constants/api";

export interface UpdateProfileInput {
  name: string;
  email: string;
  dob: string;
  tob: string;
}

export const userService = {

  getCurrentUser: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data.data;
  },

  getUserById: async (userId: string) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.USER_DETAILS(userId));
    return response.data.data;
  },

  completeRegistration: async (profileData: UpdateProfileInput) => {
    const response = await api.put(API_ENDPOINTS.AUTH.COMPLETE_REGISTRATION, profileData);
    return response.data.data;
  },

  updateOnlineStatus: async (isOnline: boolean) => {
    const response = await api.patch(API_ENDPOINTS.USERS.UPDATE_STATUS, {
      isOnline,
    });

    return response.data;
  }
};