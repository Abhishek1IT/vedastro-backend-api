import AuthRepository from "./auth.repository.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import ApiError from "../../utils/ApiError.js";

class AuthService {
  async completeProfile(userId, { name, email, dob }) {
    const user = await AuthRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.name = name;
    user.email = email;
    user.dob = dob;
    user.profileCompleted = true;

    await user.save();

    return user;
  }

  // Send OTP
  async sendOtp(phone) {
    let user = await AuthRepository.findByPhone(phone);

    if (!user) {
      user = await AuthRepository.create({
        phone,
        profileCompleted: false,
        isVerified: false,
      });
    }

    // const otp = math.floor(100000 + Math.random() * 900000).toString(); 
    const otp = "123456";
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await AuthRepository.saveOtp(phone, otp, otpExpiry);

    return {
      message: "OTP sent successfully",
    };
  }

  // Verify OTP
  async verifyOtp(phone, otp) {
    const user = await AuthRepository.findByPhone(phone);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.otp !== otp) {
      throw new ApiError(400, "Invalid OTP");
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      throw new ApiError(400, "OTP Expired");
    }

    user.isVerified = true;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;

    await user.save();
    await AuthRepository.clearOtp(user._id);

    return {
      message: "OTP verified successfully",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        id: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
    };
  }
  
  async logout(userId) {
    await AuthRepository.clearRefreshToken(userId);
  }

  async me(userId) {
    const user = await AuthRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  async refreshToken(oldRefreshToken) {
    if (!oldRefreshToken) {
      throw new ApiError(401, "Refresh Token Required");
    }

    const user = await AuthRepository.findByRefreshToken(oldRefreshToken);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await AuthRepository.updateRefreshToken(user._id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
