import { AppError } from "../middlewares/errorHandler.js";
import { User } from "../models/userModel.js";

export const updateUserCtrl = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  try {
    if (!user) {
      throw new AppError("User not found", 404);
    }
    // find username
    const findUsername = await User.findOne({ username: req.body.username });
    if (findUsername) {
      throw new AppError("Username already exists", 400);
    }

    user.username = req.body.username || user.username;
    if (req.body.oldPassword && req.body.newPassword) {
      const isMatch = await user.comparePassword(req.body.oldPassword);
      if (!isMatch) {
        throw new AppError("Invalid old password", 400);
      }
      user.password = req.body.newPassword;
    }

    const updatedUser = await user.save();
    const { password: _password, ...otherDetails } = updatedUser._doc;
    res.status(200).json({
      message: "User updated successfully",
      data: otherDetails,
    });
  } catch (error) {
    next(error);
  }
};
