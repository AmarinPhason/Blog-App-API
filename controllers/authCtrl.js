import { AppError } from "../middlewares/errorHandler.js";
import { User } from "../models/userModel.js";
export const registerCtrl = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      throw new AppError("Please enter all fields", 400);
    }
    const findUser = await User.findOne({ email });
    if (findUser) {
      throw new AppError("User already exists", 400);
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
