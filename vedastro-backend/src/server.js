import http from "http";

import app from "./app.js";

import connectDB from "./config/db.js";
import { env } from "./config/env.js";

import { initSocket } from "./config/socket.js";

import registerChatSocket from "./modules/chat/chat.socket.js";
import registerCallSocket from "./modules/call/call.socket.js";

import User from "./models/User.js";

async function startServer() {
  try {
    // Database
    await connectDB();

    await User.updateMany(
      { isOnline: true },
      {
        $set: {
          isOnline: false,
        },
      }
    );

    console.log("All users marked offline");

    // HTTP Server
    const server = http.createServer(app);

    // Socket.IO
    const io = initSocket(server);

    app.set("io", io);

    registerChatSocket(io);
    registerCallSocket(io);

    server.listen(env.PORT, () => {
      console.log(
        `Server Running Port : ${env.PORT} Environment : ${env.NODE_ENV}`,
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();