import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "./env.js";


const parseCookies = (cookieString = "") => {
  return cookieString.split(";").reduce((res, cookie) => {

    const index = cookie.indexOf("=");

    if (index > -1) {

      const key = cookie
        .slice(0, index)
        .trim();

      const value = cookie
        .slice(index + 1)
        .trim();

      res[key] = decodeURIComponent(value);

    }

    return res;

  }, {});
};


export const onlineUsers = new Map();


export const socketAuth = (io) => {

  io.use(async (socket, next) => {

    try {

      const cookies = parseCookies(
        socket.handshake.headers.cookie
      );


      const token = socket.handshake.auth?.token || cookies.accessToken;


      if (!token) {

        console.log(
          "Socket Auth Failed: accessToken missing"
        );

        return next(
          new Error("Authentication Failed")
        );
      }


      const decoded = jwt.verify(
        token,
        env.JWT_SECRET
      );


      const user = await User.findById(
        decoded.id
      );


      if (!user) {

        return next(
          new Error("User Not Found")
        );

      }


      socket.user = {

        id: user._id.toString(),

        name: user.name,

        role: user.role,

      };



      if (!onlineUsers.has(socket.user.id)) {

        onlineUsers.set(
          socket.user.id,
          new Set()
        );

      }


      onlineUsers
        .get(socket.user.id)
        .add(socket.id);



      console.log(
        "Socket Auth Success:",
        socket.user.id
      );


      next();


    } catch (error) {


      console.log(
        "Socket Auth Error:",
        error.message
      );


      next(
        new Error("Authentication Failed")
      );

    }

  });

};