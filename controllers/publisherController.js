import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Publisher } from "../models/Publisher.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import cloudinary from "cloudinary";


export const registerPublisher = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const file = req.file;
    
    if (!name || !email || !password )
      return next(new ErrorHandler("Please enter all fields", 400));
    let publisher = await Publisher.findOne({ email });
    if (publisher) return next(new ErrorHandler("Publisher Already Exists", 409));
  
    let avatar = {};
  
    if (file) {
      const fileUri = getDataUri(file);
      const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
  
      avatar = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      };
    }
  
    publisher = await Publisher.create({
      name,
      email,
      password,
      avatar,
    });
  
    sendToken(res, publisher, "Registered Successfully", 201);
  });


  export const loginPublisher = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new ErrorHandler("Please enter all field", 400));
  
    const publisher = await Publisher.findOne({ email }).select("+password");
    if (!publisher) return next(new ErrorHandler("User Doesnt Exist", 401));
  
    const isMatch = await publisher.comparePassword(password);
    if (!isMatch) return next(new ErrorHandler("Incorrect Password", 401));
  
    sendToken(res, publisher, `Welcome back, ${publisher.name}`, 200);
  });
  
  export const logoutPublisher = catchAsyncError(async (req, res, next) => {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        success: true,
        message: "Logged Out Successfully",
      });
  });