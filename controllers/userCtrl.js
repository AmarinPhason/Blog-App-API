import { AppError } from "../middlewares/errorHandler.js";
import { User } from "../models/userModel.js";

export const updateUserCtrl = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    // find username
    const findUsername = await User.findOne({ username: req.body.username });
    if (findUsername) {
      return next(new AppError("Username already exists", 400));
    }

    user.username = req.body.username || user.username;
    if (req.body.oldPassword && req.body.newPassword) {
      const isMatch = await user.comparePassword(req.body.oldPassword);
      if (!isMatch) {
        return next(new AppError("Invalid password", 400));
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

// delete user
export const deleteUserCtrl = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  try {
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    await user.deleteOne();
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    user.isAdmin = !user.isAdmin;
    const updatedUser = await user.save();
    res.status(200).json({
      message: "User updated successfully",
      admin: updatedUser.isAdmin,
    });
  } catch (error) {
    next(error);
  }
};
export const getUserCtrl = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const user = await User.find({})
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: sortDirection });
    const totalUser = await User.countDocuments();
    const usersWithoutPassword = user.map((user) => {
      const { password: _password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      message: "User fetched successfully",
      user: usersWithoutPassword,
      totalUser: totalUser,
      lastMonthUsers: lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
