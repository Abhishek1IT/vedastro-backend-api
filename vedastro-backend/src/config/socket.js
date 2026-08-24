import { Server } from "socket.io";
import { socketAuth } from "./socketAuthHandler.js";

let io = null;


export const initSocket = (server) => {

  io = new Server(server, {

    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
          origin.startsWith("http://localhost:") ||
          origin.endsWith(".vercel.app")
        ) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
      methods: ["GET", "POST"]
    },


    transports: [
      "websocket",
      "polling",
    ],


    pingInterval: 25000,

    pingTimeout: 60000,

  });

  socketAuth(io);

  io.on(
    "connection",
    (socket) => {

      console.log(
        "Socket Connected:",
        socket.id,
        "User:",
        socket.user?.id
      );

      socket.on(
        "disconnect",
        (reason) => {

          console.log(
            "Socket Disconnected:",
            reason
          );

        }
      );

    }
  );

  return io;
};

export const getIO = () => {

  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }
  return io;
};