import User from "../models/User.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authMiddleware = async (req, res, next) => {
  try {

    const token = req.cookies?.accessToken;

    if (!token || token === "undefined" || token === "null") {

      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing",
      });
    }

    const decoded = verifyAccessToken(token);

    const userId = decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token: user id missing",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired Token",
    });
  }
};

export default authMiddleware;