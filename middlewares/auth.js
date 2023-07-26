import Jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Publisher } from "../models/Publisher.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return next(new ErrorHandler("Not Logged In", 401));
  const decoded = Jwt.verify(token, process.env.JWT_SECRET);
  req.publisher = await Publisher.findById(decoded._id);
  next();
});

export const authorizeAdmin = (req, res, next) => {
  if (req.publisher.role !== "admin")
    return next(
      new ErrorHandler(`${req.publisher.role} is not allowed this resource`, 403)
    );
  next();
};