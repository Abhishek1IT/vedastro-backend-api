import User from "../../models/User.js";
import { ROLES } from "../../common/roles.js";

class UserRepository {
  async findById(userId) {
    return await User.findById(userId).select("-otp -otpExpiry -refreshToken");
  }

  async findByPhone(phone) {
    return await User.findOne({ phone }).select(
      "+otp +otpExpiry +refreshToken",
    );
  }

  async createUser(data) {
    return await User.create(data);
  }

  async updateUser(userId, data) {
    return await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    }).select("-otp -otpExpiry -refreshToken");
  }

  async saveOtp(phone, otp, otpExpiry) {
    return await User.findOneAndUpdate(
      { phone },
      {
        otp,
        otpExpiry,
      },
      {
        new: true,
      },
    ).select("+otp +otpExpiry");
  }

  async clearOtp(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        otp: null,
        otpExpiry: null,
      },
      {
        new: true,
      },
    );
  }

  async updateRefreshToken(userId, refreshToken) {
    return await User.findByIdAndUpdate(
      userId,
      {
        refreshToken,
      },
      {
        new: true,
      },
    );
  }

  async getAstrologersProfile() {
    return await User.find({
      role: ROLES.ASTROLOGER,
    }).select("-otp -otpExpiry -refreshToken");
  }
  
  async updateProfile(userId, data) {
    return await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    }).select("-otp -otpExpiry -refreshToken");
  }

  async updateOnlineStatus(userId, isOnline) {
    return await User.findByIdAndUpdate(
      userId,
      {
        isOnline,
        lastSeen: new Date(),
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-otp -otpExpiry -refreshToken");
  }

  async deleteAccount(userId) {
    return await User.findByIdAndDelete(userId);
  }

  async getUsersForChat(currentUser) {
    const role = currentUser.role;
    const userId = currentUser.id;

    if (role === ROLES.ADMIN) {
      return await User.find({
        role: {
          $in: [ROLES.USER, ROLES.ASTROLOGER],
        },
        _id: {
          $ne: userId,
        },
      }).select("-otp -otpExpiry -refreshToken");
    }

    if (role === ROLES.ASTROLOGER) {
      return await User.find({
        role: ROLES.USER,
      }).select("-otp -otpExpiry -refreshToken");
    }

    return await User.find({
      role: ROLES.ASTROLOGER,
    }).select("-otp -otpExpiry -refreshToken");
  }
}

export default new UserRepository();