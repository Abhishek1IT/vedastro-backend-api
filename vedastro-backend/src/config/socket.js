import { Server } from "socket.io";
import { socketAuth } from "./socketAuthHandler.js";

let io = null;


export const initSocket = (server) => {

  io = new Server(server, {

    cors: {
      origin: [
        "https://vedastro-backend-api-3hvy.vercel.app",
        "https://ved-astro-1uq2-lgf7tlssp-abhishek1its-projects.vercel.app",
        "http://localhost:3000"
      ],
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
    throw new Error(
      "Socket.IO is not initialized"
    );
  }


  return io;

};