import AuthService from "./auth.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { registerSchema } from "./auth.validation.js";
import { z } from "zod"; //

class AuthController {
  // Register
  async register(req, res, next) {
    try {
      const validatedData = registerSchema.parse(req.body);

      const { user } = await AuthService.registerUser(validatedData);

      return res.status(201).json(
        new ApiResponse(
          201,
          {
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              dob: user.dob,
              role: user.role,
              profileCompleted: user.profileCompleted,
              approvalStatus: user.approvalStatus,
            }
          },
          "User registration successfully.",
        ),
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Mismatch",
          errors: error.errors.map((e) => ({
            field: e.path[0],
            message: e.message,
          })),
        });
      }
      next(error);
    }
  }

  // Send OTP
  async sendOtp(req, res, next) {
    try {
      const { phone, role } = req.body;

      const result = await AuthService.sendOtp(phone, role);

      return res
        .status(200)
        .json(new ApiResponse(200, result, "OTP Sent Successfully"));
    } catch (error) {
      next(error);
    }
  }

  // Verify OTP
  async verifyOtp(req, res, next) {
    try {
      const { phone, otp, role } = req.body;

      const result = await AuthService.verifyOtp(
        phone,
        otp,
        role
      );

      const isProduction =
        process.env.NODE_ENV === "production";

      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      };

      res.cookie("accessToken", result.accessToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("refreshToken", result.refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        message: "OTP Verified Successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async completeProfile(req, res, next) {
    try {
      const updateData = {
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        gender: req.body.gender,
        birthPlace: req.body.birthPlace,
        birthTime: req.body.birthTime,
      };

      if (req.user.role === "ASTROLOGER") {
        updateData.experience = req.body.experience;
        updateData.skills = req.body.skills;
        updateData.languages = req.body.languages;
        updateData.consultationPrice = req.body.consultationPrice;
        updateData.bio = req.body.bio;
      }

      const updatedUser = await AuthService.completeProfile(
        req.user.id,
        updateData,
      );

      return res.json(
        new ApiResponse(
          200,
          updatedUser,
          "Profile completed successfully",
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  // Login User
  // async login(req, res, next) {
  //   try {
  //     const { phone } = req.body;

  //     const result = await AuthService.login(phone);

  //     const cookieOptions = {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: "none",
  //       path: "/",
  //     };

  //     res.cookie("accessToken", result.accessToken, {
  //       ...cookieOptions,
  //       maxAge: 15 * 60 * 1000,
  //     });

  //     res.cookie("refreshToken", result.refreshToken, {
  //       ...cookieOptions,
  //       maxAge: 7 * 24 * 60 * 60 * 1000,
  //     });

  //     const user = result.user.toObject();

  //     delete user.password;
  //     delete user.otp;
  //     delete user.otpExpiry;
  //     delete user.refreshToken;

  //     return res.status(200).json(
  //       new ApiResponse(
  //         200,
  //         {
  //           user,
  //           accessToken: result.accessToken,
  //           refreshToken: result.refreshToken,
  //         },
  //         "Login Successful"
  //       )
  //     );
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // Current User
  async me(req, res, next) {
    try {
      const user = await AuthService.me(req.user._id);

      return res.status(200).json(
        new ApiResponse(200, user, "User Found")
      );
    } catch (error) {
      next(error);
    }
  }

  // Logout
  async logout(req, res, next) {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh Token
  async refreshToken(req, res, next) {
    try {
      const refreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token missing",
        });
      }

      const result =
        await AuthService.refreshToken(refreshToken);

      const isProduction =
        process.env.NODE_ENV === "production";

      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      };

      res.cookie("accessToken", result.accessToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("refreshToken", result.refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          },
          "Tokens Refreshed Successfully",
        ),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
