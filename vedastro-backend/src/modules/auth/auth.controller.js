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
            },
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
      const { phone } = req.body;

      const result = await AuthService.sendOtp(phone);

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
      const { phone, otp } = req.body;

      const result = await AuthService.verifyOtp(phone, otp);

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      };

      res.cookie("accessToken", result.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", result.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          },
          "OTP Verified Successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  }

  // Complete Profile
  async completeProfile(req, res, next) {
    try {
      console.log("BODY:", req.body);
      console.log("USER:", req.user);

      const { name, email, dob } = req.body;

      const user = await AuthService.completeProfile(req.user._id, {
        name,
        email,
        dob,
      });

      console.log("SAVED USER:", user);

      return res.status(200).json(
        new ApiResponse(200, user, "Profile completed successfully")
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
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "lax",
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
      console.log("REQ USER:", req.user);

      await AuthService.logout(req.user._id);

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      };

      res.clearCookie("accessToken", cookieOptions);
      res.clearCookie("refreshToken", cookieOptions);

      return res.status(200).json({
        success: true,
        message: "Logout Successful",
      });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      next(error);
    }
  }

  // Refresh Token
  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      const result = await AuthService.refreshToken(refreshToken);

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
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
