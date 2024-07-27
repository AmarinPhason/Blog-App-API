import { AppError } from "../middlewares/errorHandler.js";
import { User } from "../models/userModel.js";
import { setCookieOptions } from "../utils/cookieOptions.js";

export const registerCtrl = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return next(new AppError("Please enter all fields", 400));
    }
    const findUser = await User.findOne({ email });
    if (findUser) {
      return next(new AppError("User already exists", 400));
    }
    const findUsername = await User.findOne({ username });
    if (findUsername) {
      return next(new AppError("Username already exists", 400));
    }
    const newUser = await User.create({ username, email, password });
    const { password: _password, ...otherDetails } = newUser._doc;
    res.status(201).json({
      message: "User created successfully",
      data: otherDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(new AppError("Please enter all fields", 400));
    }
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return next(new AppError("User does not exist", 400));
    }
    const isMatch = await findUser.comparePassword(password);
    if (!isMatch) {
      return next(new AppError("Invalid password", 400));
    }
    const { password: _password, ...otherDetails } = findUser._doc;
    const token = findUser.generateToken();
    res.status(200).cookie("access_token", token, setCookieOptions()).json({
      message: "Login successful",
      data: otherDetails,
      token,
    });
  } catch (error) {
    next(error);
  }
};
