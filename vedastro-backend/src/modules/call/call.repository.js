import Call from "../../models/Call.js";

class CallRepository {
  async create(callData) {
    return await Call.create(callData);
  }

  async findById(callId) {
    return await Call.findById(callId)
      .populate("caller", "name avatar role")
      .populate("receiver", "name avatar role");
  }

  async update(callId, data) {
    return await Call.findByIdAndUpdate(callId, data, {
      new: true,
    });
  }

  async getUserCalls(userId) {
    return await Call.find({
      $or: [
        { caller: userId },
        { receiver: userId },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("caller", "name avatar")
      .populate("receiver", "name avatar");
  }
}

export default new CallRepository();