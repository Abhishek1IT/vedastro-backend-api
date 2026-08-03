import User from "../models/User.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authMiddleware = async (req, res, next) => {
  try {
    console.log("AUTH");
    console.log("Cookies:", req.cookies);
    console.log("AccessToken:", req.cookies?.accessToken);
    console.log("Headers Cookie:", req.headers.cookie);

    const token = req.cookies?.accessToken;

    if (!token || token === "undefined" || token === "null") {
      console.log("Token Missing");

      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing",
      });
    }

    const decoded = verifyAccessToken(token);

    console.log("Decoded Token:", decoded);

    const userId = decoded.id || decoded._id;

    const user = await User.findById(userId);

    console.log("User:", user);

    req.user = user;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired Token",
    });
  }
};

export default authMiddleware;