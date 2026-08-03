import AdminRepository from "./admin.repository.js";
import ChatService from "../chat/chat.service.js";

class AdminService {
  async getUsers() {
    return await AdminRepository.getAllUsers();
  }

  async getAstrologers() {
    return await AdminRepository.getAllAstrologers();
  }

  async getChatUsers() {
    return await AdminRepository.getChatUsers();
  }

  async getUser(id) {
    return await AdminRepository.getById(id);
  }

  async getConversations(adminId) {
    return await ChatService.getConversations(adminId);
  }
}

export default new AdminService();
