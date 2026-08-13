import UserService from "./user.service.js";
import User from "../../models/User.js";
import ApiResponse from "../../utils/ApiResponse.js";

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await UserService.getProfile(req.user.id);

      return res.json(
        new ApiResponse(200, user, "User profile fetched successfully"),
      );
    } catch (error) {
      next(error);
    }
  }

  async getAstrologersProfile(req, res, next) {
  try {
    const astrologers = await User.find({
      role: "ASTROLOGER",
      status: "ACTIVE",
    }).select(
      "name avatar language languages experience skills rating totalOrders consultationPrice badge isOnline"
    );

    return res.status(200).json({
      success: true,
      data: astrologers,
    });
  } catch (error) {
    next(error);
  }
}

  async updateProfile(req, res, next) {
    try {
      const updatedUser = await UserService.updateProfile(
        req.user.id,
        req.body,
      );

      return res.json(
        new ApiResponse(200, updatedUser, "Profile updated successfully"),
      );
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { isOnline } = req.body;

      const updatedUser = await UserService.updateOnlineStatus(
        req.user.id,
        Boolean(isOnline),
      );

      return res.status(200).json({
        success: true,
        data: updatedUser,
        message: "Status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;

      await UserService.changePassword(req.user.id, oldPassword, newPassword);

      return res.json(
        new ApiResponse(200, null, "Password changed successfully"),
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req, res, next) {
    try {
      await UserService.deleteAccount(req.user.id);

      return res.json(
        new ApiResponse(200, null, "Account deleted successfully"),
      );
    } catch (error) {
      next(error);
    }
  }

  async getChatUsers(req, res, next) {
    try {
      const users = await UserService.getChatUsers(req.user);

      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
