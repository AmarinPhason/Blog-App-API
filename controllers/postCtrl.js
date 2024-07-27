import { AppError } from "../middlewares/errorHandler.js";
import { Post } from "../models/postModel.js";
export const createPostCtrl = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return next(new AppError("Title and content are required", 400));
    }
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");
    const newPost = new Post({ ...req.body, slug, author: req.user._id });
    const data = await newPost.save();
    res.status(201).json({
      message: "Post created successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
