import CallService from "./call.service.js";
import User from "../../models/User.js";
import { onlineUsers } from "../../config/socketAuthHandler.js";

const registerCallSocket = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.user.id;

    // Start Call
    socket.on("call:user", async ({ receiverId }, callback) => {
      try {
        console.log(`${socket.user.name} Started Call -> ${receiverId}`);

        const receiverSockets = onlineUsers.get(receiverId);

        if (receiverSockets) {
          receiverSockets.forEach((socketId) => {
            io.to(socketId).emit("message:new", message);
          });
        }

        if (!receiverSocketId) {
          return callback?.({
            success: false,
            message: "User is offline",
          });
        }

        const call = await CallService.createCall(userId, receiverId);

        io.to(`user:${receiverId}`).emit("call:incoming", {
          callId: call._id,
          caller: {
            id: userId,
            name: socket.user.name,
          },
        });

        callback?.({
          success: true,
          data: call,
        });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message,
        });
      }
    });

    // Accept Call
    socket.on("call:accept", async ({ callId, callerId }, callback) => {
      try {
        console.log(`${socket.user.name} Accepted Call`);

        await CallService.acceptCall(callId);

        const receiver = await User.findById(userId).select("name");

        io.to(`user:${callerId}`).emit("call:accepted", {
          callId,
          receiverId: userId,
          receiver: {
            id: receiver._id,
            name: receiver.name,
          },
        });

        callback?.({
          success: true,
        });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message,
        });
      }
    });

    // Reject Call
    socket.on("call:reject", async ({ callId, callerId }, callback) => {
      try {
        console.log(`${socket.user.name} Rejected Call`);

        await CallService.rejectCall(callId);

        io.to(`user:${callerId}`).emit("call:rejected", {
          callId,
        });

        callback?.({
          success: true,
        });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message,
        });
      }
    });

    // WebRTC Offer
    socket.on("call:offer", ({ receiverId, offer }) => {
      io.to(`user:${receiverId}`).emit("call:offer", {
        offer,
        senderId: userId,
      });
    });

    // WebRTC Answer
    socket.on("call:answer", ({ receiverId, answer }) => {
      io.to(`user:${receiverId}`).emit("call:answer", {
        answer,
        senderId: userId,
      });
    });

    // ICE Candidate
    socket.on("call:ice-candidate", ({ receiverId, candidate }) => {
      io.to(`user:${receiverId}`).emit("call:ice-candidate", {
        candidate,
        senderId: userId,
      });
    });

    // End Call
    socket.on("call:end", async ({ callId, receiverId }, callback) => {
      try {
        console.log(`${socket.user.name} Ended Call`);

        await CallService.endCall(callId);

        io.to(`user:${receiverId}`).emit("call:ended", {
          callId,
        });

        callback?.({
          success: true,
        });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message,
        });
      }
    });
  });
};

export default registerCallSocket;
