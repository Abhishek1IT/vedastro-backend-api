import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (user) => {
  const userId = user?._id || user?.id || user;

  return jwt.sign(
    {
      id: userId,
      _id: userId,
      role: user?.role || "user",
      version: user.sessionVersion,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN || "7d",
    }
  );
};

export const generateRefreshToken = (user) => {
  const userId = user?._id || user?.id || user;

  return jwt.sign(
    {
      id: userId,
      _id: userId,
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN || "30d",
    }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
};