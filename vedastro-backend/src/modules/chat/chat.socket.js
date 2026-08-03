import User from "../../models/User.js";
import { onlineUsers } from "../../config/socketAuthHandler.js";

export default function registerChatSocket(io) {

  io.on("connection", async (socket) => {

    const userId = socket.user.id;

    console.log(
      `${socket.user.name} Socket Connected`
    );

    // user room join
    socket.join(`user:${userId}`);

    // online map
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    await User.findByIdAndUpdate(
      userId,
      {
        isOnline: true,
        lastSeen: new Date()
      }
    );

    console.log("Connected User:", userId);

    io.emit("user:online", { userId });

    console.log("Online Event Emitted:", userId);

    // join conversation
    socket.on(
      "conversation:join",
      (conversationId, callback) => {

        socket.join(
          `conversation:${conversationId}`
        );

        console.log(
          `${socket.user.name} joined conversation ${conversationId}`
        );

        callback?.({
          success: true
        });

      }
    );

    socket.on(
      "conversation:leave",
      (conversationId) => {

        socket.leave(
          `conversation:${conversationId}`
        );
      }
    );

    socket.on("typing:start", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing:start", {
        userId: socket.user.id,
      });
    });

    socket.on("typing:stop", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing:stop", {
        userId: socket.user.id,
      });
    });

    socket.on("disconnect", async (reason) => {
      console.log(`${socket.user.name} Disconnected`);
      console.log("Reason:", reason);

      const sockets = onlineUsers.get(userId);

      if (sockets) {
        sockets.delete(socket.id);

        if (sockets.size === 0) {
          onlineUsers.delete(userId);

          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
          });

          io.emit("user:offline", {
            userId,
          });
        }
      }
    });
  });
}