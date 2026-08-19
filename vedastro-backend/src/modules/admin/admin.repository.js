import User from "../../models/User.js";

class AdminRepository {
  async getAllUsers() {
    return await User.find({
      role: "USER",
    }).select("-password -refreshToken");
  }

  async getAllAstrologers() {
    return await User.find({
      role: "ASTROLOGER",
    }).select("-password -refreshToken");
  }

  async getPendingAstrologers() {
    return await User.find({
      role: "ASTROLOGER",
      approvalStatus: "PENDING",
    }).select("-password -refreshToken");
  }

  async getAstrologerById(id) {
    return await User.findById(id).select("-password -refreshToken");
  }

  async updateAstrologerApproval(id, approvalStatus, rejectionReason) {
    const updateData = {
      approvalStatus,
      rejectionReason: approvalStatus === "REJECTED" ? rejectionReason : null,
    };

    return await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password -refreshToken");
  }

  async getChatUsers() {
    return await User.find({
      role: {
        $in: ["USER", "ASTROLOGER"],
      },
    })
      .select(
        "name role avatar isOnline lastSeen phone email experience language"
      )
      .sort({ role: 1, name: 1 });
  }

  async getById(id) {
    return await User.findById(id).select("-password -refreshToken");
  }
}

export default new AdminRepository();
