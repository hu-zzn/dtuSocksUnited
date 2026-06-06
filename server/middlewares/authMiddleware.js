import jwt from "jsonwebtoken";
import { supabase } from "../database/supabaseClient.js";
import { mapUserFromDb } from "../models/userModel.js";
import ErrorHandler from "./errorMiddlewares.js";

// 🔐 Authentication Middleware
export const isAuthenticated = async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new ErrorHandler("Please login first.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const { data: dbUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.id)
      .maybeSingle();

    if (error || !dbUser) {
      return next(new ErrorHandler("User not found.", 404));
    }

    req.user = mapUserFromDb(dbUser);
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
