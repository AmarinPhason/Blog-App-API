import { User } from "../models/userModel.js";

export const registerCtrl = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).json({ message: "Email already exists" });
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
