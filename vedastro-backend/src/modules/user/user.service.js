import bcrypt from "bcryptjs";
import UserRepository from "./user.repository.js";
import User from "../../models/User.js";
import ApiError from "../../utils/ApiError.js";

class UserService {
  async getProfile(userId) {
    return await UserRepository.findById(userId);
  }

  async getAstrologersProfile() {
    return await UserRepository.getAstrologersProfile();
  }

  async updateProfile(userId, data) {
    return await UserRepository.updateProfile(userId, data);
  }

  async updateOnlineStatus(userId, isOnline) {
    return await UserRepository.updateOnlineStatus(userId, isOnline);
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw new ApiError(400, "Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await UserRepository.updatePassword(userId, hashedPassword);

    return true;
  }

  async deleteAccount(userId) {
    await UserRepository.deleteAccount(userId);

    return true;
  }

  async getChatUsers(currentUser) {
    return await UserRepository.getUsersForChat(currentUser);
  }
}

export default new UserService();
