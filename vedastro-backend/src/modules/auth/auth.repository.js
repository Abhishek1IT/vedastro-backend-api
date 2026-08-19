import User from "../../models/User.js";

class AuthRepository {
  // Find User By Phone
  async findByPhone(phone) {
    return await User.findOne({ phone }).select(
      "+otp +otpExpiry +refreshToken",
    );
  }

  // Find User By Id
  async findById(id) {
    return await User.findById(id).select(
      "name email phone dob role profileCompleted approvalStatus rejectionReason avatar experience skills languages consultationPrice createdAt"
    );
  }

  // Create New User
  async create(userData) {
    return await User.create(userData);
  }

  // Save OTP
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

  // Clear OTP
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

  // Find User By Refresh Token
  async findByRefreshToken(token) {
    return await User.findOne({ refreshToken: token }).select(
      "+otp +otpExpiry +refreshToken",
    );
  }

  // Save Refresh Token
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

  // Remove Refresh Token
  async clearRefreshToken(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        refreshToken: null,
      },
      {
        new: true,
      },
    );
  }
}

export default new AuthRepository();
