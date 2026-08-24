import User from "../../models/User.js";
import { onlineUsers } from "../../config/socketAuthHandler.js";

export default function registerChatSocket(io) {
  io.on("connection", (socket) => {
    const userId = String(socket.user.id);

    console.log(
      `${socket.user.name} Socket Connected: ${socket.id}`,
    );

    socket.join(`user:${userId}`);

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    // Register listeners synchronously
    socket.on(
      "conversation:join",
      (conversationId, callback) => {
        if (!conversationId) {
          callback?.({
            success: false,
            message: "Conversation ID required",
          });

          return;
        }

        const room = `conversation:${conversationId}`;

        socket.join(room);

        console.log(
          `${socket.user.name} joined ${room}`,
        );

        callback?.({
          success: true,
          conversationId,
        });
      },
    );

    socket.on(
      "conversation:leave",
      (conversationId) => {
        if (!conversationId) {
          return;
        }

        socket.leave(
          `conversation:${conversationId}`,
        );

        console.log(
          `${socket.user.name} left conversation:${conversationId}`,
        );
      },
    );

    socket.on(
      "typing:start",
      ({ conversationId }) => {
        if (!conversationId) {
          return;
        }

        socket
          .to(`conversation:${conversationId}`)
          .emit("typing:start", {
            userId,
          });
      },
    );

    socket.on(
      "typing:stop",
      ({ conversationId }) => {
        if (!conversationId) {
          return;
        }

        socket
          .to(`conversation:${conversationId}`)
          .emit("typing:stop", {
            userId,
          });
      },
    );

    socket.on(
      "disconnect",
      async (reason) => {
        console.log(
          `${socket.user.name} Disconnected`,
        );

        console.log(
          "Socket:",
          socket.id,
        );

        console.log(
          "Reason:",
          reason,
        );

        const sockets =
          onlineUsers.get(userId);

        if (!sockets) {
          return;
        }

        sockets.delete(socket.id);

        if (sockets.size === 0) {
          onlineUsers.delete(userId);

          try {
            await User.findByIdAndUpdate(
              userId,
              {
                isOnline: false,
                lastSeen: new Date(),
              },
            );

            io.emit("user:offline", {
              userId,
            });

            console.log(
              "User Offline:",
              userId,
            );
          } catch (err) {
            console.error("Disconnect DB error:", err);
          }
        }
      },
    );

    // Perform async database update after listeners are registered
    (async () => {
      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          lastSeen: new Date(),
        });

        console.log("Connected User:", userId);

        io.emit("user:online", {
          userId,
        });
      } catch (error) {
        console.error(
          "Chat socket connection DB error:",
          error,
        );
      }
    })();
  });
}
