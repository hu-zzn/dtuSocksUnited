// import jwt from "jsonwebtoken";
// import { User } from "../models/userModel.js";

// // 🔐 Authentication Middleware
// export const isAuthenticated = async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return res.status(401).json({ message: "Please login first." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.user = await User.findById(decoded.id);
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token." });
//   }
// };

// // 👮‍♂️ Authorization Middleware
// export const isAuthorized = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         message: `User with role '${req.user.role}' is not allowed to access this resource.`,
//       });
//     }
//     next();
//   };
// };

import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import ErrorHandler from "./errorMiddlewares.js"; // ✅ adjust path if needed

// 🔐 Authentication Middleware
export const isAuthenticated = async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new ErrorHandler("Please login first.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found.", 404));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorHandler("Invalid token.", 401));
  }
};

// 👮‍♂️ Authorization Middleware
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `User with role '${req.user?.role}' is not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};
