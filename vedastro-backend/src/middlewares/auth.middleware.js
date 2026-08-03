import User from "../models/User.js";
import { verifyAccessToken } from "../utils/jwt.js";


const authMiddleware = async (req, res, next) => {

  try {


    // Get token from HTTP Only Cookie
    const token = req.cookies?.accessToken;



    if (
      !token ||
      token === "undefined" ||
      token === "null"
    ) {

      return res.status(401).json({

        success: false,

        message: "Unauthorized: Token missing",

      });

    }



    const decoded =
      verifyAccessToken(token);



    const userId =
      decoded?.id ||
      decoded?._id;



    if (!userId) {

      return res.status(401).json({

        success: false,

        message: "Invalid token payload",

      });

    }



    const user =
      await User
        .findById(userId)
        .select("-password");



    if (!user) {

      return res.status(401).json({

        success: false,

        message: "User not found",

      });

    }



    // Session version check
    if (
      decoded.version !== user.sessionVersion
    ) {

      return res.status(401).json({

        success: false,

        message: "Session expired",

      });

    }



    req.user = user;


    next();



  } catch (error) {


    console.error(
      "Auth Middleware Error:",
      error.message
    );


    return res.status(401).json({

      success: false,

      message: "Invalid or expired Token",

    });


  }

};



export default authMiddleware;