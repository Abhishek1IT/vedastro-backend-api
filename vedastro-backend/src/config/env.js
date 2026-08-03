import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,

  MONGODB_URI: process.env.MONGODB_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,

  CLIENT_URL: process.env.CLIENT_URL,
};
