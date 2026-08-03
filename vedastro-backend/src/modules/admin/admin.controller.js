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
