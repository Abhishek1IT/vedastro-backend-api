import AdminRepository from "./admin.repository.js";
import ChatService from "../chat/chat.service.js";

class AdminService {
  async getUsers() {
    return await AdminRepository.getAllUsers();
  }

  async getAstrologers() {
    return await AdminRepository.getAllAstrologers();
  }

  async getPendingAstrologers() {
    return await AdminRepository.getPendingAstrologers();
  }

  async getAstrologer(id) {
    return await AdminRepository.getAstrologerById(id);
  }

  async approveAstrologer(id, approvalStatus, rejectionReason) {
    return await AdminRepository.updateAstrologerApproval(
      id,
      approvalStatus,
      rejectionReason
    );
  }

  async rejectAstrologer(id, rejectionReason) {
    return await AdminRepository.updateAstrologerApproval(
      id,
      false,
      rejectionReason
    );
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
