import AuthRepository from "./auth.repository.js";
import User from "../../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import ApiError from "../../utils/ApiError.js";
import { ROLES } from "../../common/roles.js";

class AuthService {
  async completeProfile(
    userId,
    {
      name,
      email,
      dob,
      gender,
      birthPlace,
      birthTime,
      avatar,
      experience,
      skills,
      languages,
      consultationPrice,
    }
  ) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.name = name;
    user.email = email;
    user.dob = dob;

    if (gender) user.gender = gender;
    if (birthPlace) user.birthPlace = birthPlace;
    if (birthTime) user.birthTime = birthTime;

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    if (user.role === ROLES.ASTROLOGER) {
      user.experience = experience ?? 0;
      user.skills = skills ?? ["Vedic Astrology",
        "Kundli Reading",
        "Kundli Matching",
        "Marriage Compatibility",
        "Career Astrology",
        "Dosha Analysis",
        "Gemstone Consultation"];

      user.languages = languages ?? ["English/Hindi"];
      user.consultationPrice = consultationPrice ?? 0;

      user.profileCompleted = true;
      user.approvalStatus = "PENDING";
      user.rejectionReason = null;
    } else {
      user.profileCompleted = true;
      user.approvalStatus = "NOT_REQUIRED";
    }

    await user.save();

    return user;
  }

  // Send OTP
  async sendOtp(phone, role) {
    const normalizedRole = String(role || "").toUpperCase();

    if (!["USER", "ASTROLOGER", "ADMIN"].includes(normalizedRole)) {
      throw new ApiError(400, "Invalid role");
    }

    let user = await AuthRepository.findByPhone(phone);

    if (!user) {
      if (normalizedRole === "ADMIN") {
        throw new ApiError(404, "Admin account not found");
      }

      user = await AuthRepository.create({
        phone,
        role: normalizedRole,
        profileCompleted: false,
        isVerified: false,
        approvalStatus:
          normalizedRole === "ASTROLOGER"
            ? "PENDING"
            : "NOT_REQUIRED",
      });
    }

    if (user.role !== normalizedRole) {
      throw new ApiError(
        403,
        `This account is registered as ${user.role}`,
      );
    }

    // Testing OTP
    const otp = "123456";

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await AuthRepository.saveOtp(phone, otp, otpExpiry);

    return {
      message: "OTP sent successfully",
    };
  }
  // Verify OTP
  async verifyOtp(phone, otp, role) {
    const normalizedRole = String(role || "").toUpperCase();

    if (!["USER", "ASTROLOGER", "ADMIN"].includes(normalizedRole)) {
      throw new ApiError(400, "Invalid role");
    }

    const user = await AuthRepository.findByPhone(phone);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role !== normalizedRole) {
      throw new ApiError(
        403,
        `This account is registered as ${user.role}`,
      );
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
        email: user.email,
        dob: user.dob,
        role: user.role,
        profileCompleted: user.profileCompleted,
        approvalStatus: user.approvalStatus,
        rejectionReason: user.rejectionReason,
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
