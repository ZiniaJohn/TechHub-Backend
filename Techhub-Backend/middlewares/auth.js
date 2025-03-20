import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user once and exclude only the password
    req.user = await User.findById(decodedData._id).select("-password");
    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }
    console.log("Authenticated user:", req.user); // For debugging
    return next();
  }

  if (!token) {
    return next(
      new ErrorHandler("Only Logged In Users can access this resource", 401)
    );
  }
});

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Only Admin can access this resource", 401));
  }
  next();
};
