// errorMiddlewares.js
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV !== "production") {
    console.error("❌ Error:", err);
  }

  if (err.code === 11000) {
    err = new ErrorHandler("Duplicate field value entered.", 400);
  }

  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("JSON Web Token is invalid. Try again.", 400);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JSON Web Token has expired. Try again.", 400);
  }

  if (err.name === "CastError") {
    err = new ErrorHandler(`Resource not found. Invalid: ${err.path}`, 400);
  }

  const errMessage = err.errors
    ? Object.values(err.errors).map((error) => error.message).join(" ")
    : err.message || "Something went wrong.";

  return res.status(err.statusCode).json({
    success: false,
    message: errMessage,
  });
};

export default ErrorHandler;
