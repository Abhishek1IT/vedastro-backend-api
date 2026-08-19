import AdminService from "./admin.service.js";

class AdminController {
  async getUsers(req, res, next) {
    try {
      const users = await AdminService.getUsers();

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAstrologers(req, res, next) {
    try {
      const astrologers = await AdminService.getAstrologers();

      res.status(200).json({
        success: true,
        data: astrologers,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPendingAstrologers(req, res, next) {
    try {
      const pendingAstrologers = await AdminService.getPendingAstrologers();

      res.status(200).json({
        success: true,
        data: pendingAstrologers,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAstrologer(req, res, next) {
    try {
      const astrologer = await AdminService.getAstrologer(req.params.id);

      res.status(200).json({
        success: true,
        data: astrologer,
      });
    } catch (error) {
      next(error);
    }
  }

  async approveAstrologer(req, res, next) {
    try {
      const { id } = req.params;
      const { approvalStatus, rejectionReason } = req.body;

      const updatedAstrologer = await AdminService.approveAstrologer(
        id,
        approvalStatus,
        rejectionReason,
      );

      res.status(200).json({
        success: true,
        data: updatedAstrologer,
        message: "Astrologer approval status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectAstrologer(req, res, next) {
    try {
      const { id } = req.params;
      const { rejectionReason } = req.body;

      const updatedAstrologer = await AdminService.rejectAstrologer(
        id,
        rejectionReason,
      );

      res.status(200).json({
        success: true,
        data: updatedAstrologer,
        message: "Astrologer rejected successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getChatUsers(req, res, next) {
    try {
      const chatUsers = await AdminService.getChatUsers();

      res.status(200).json({
        success: true,
        data: chatUsers,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await AdminService.getUser(req.params.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getChats(req, res, next) {
    try {
      const chats = await AdminService.getConversations(req.user.id);

      res.status(200).json({
        success: true,
        data: chats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
