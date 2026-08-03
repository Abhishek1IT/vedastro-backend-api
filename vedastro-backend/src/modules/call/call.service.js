import CallRepository from "./call.repository.js";

class CallService {
  async createCall(callerId, receiverId) {
    return await CallRepository.create({
      caller: callerId,
      receiver: receiverId,
      status: "RINGING",
      type: "AUDIO",
    });
  }

  async acceptCall(callId) {
    return await CallRepository.update(callId, {
      status: "ACCEPTED",
      startedAt: new Date(),
    });
  }

  async rejectCall(callId) {
    return await CallRepository.update(callId, {
      status: "REJECTED",
      endedAt: new Date(),
    });
  }

  async endCall(callId) {
    const call = await CallRepository.findById(callId);

    const duration = Math.floor(
      (Date.now() - new Date(call.startedAt).getTime()) / 1000
    );

    return await CallRepository.update(callId, {
      status: "ENDED",
      endedAt: new Date(),
      duration,
    });
  }

  async history(userId) {
    return await CallRepository.getUserCalls(userId);
  }
}

export default new CallService();