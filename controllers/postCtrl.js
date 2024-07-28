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

export const getPostCtrl = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Create a filter object based on query parameters
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.slug) filter.slug = req.query.slug;
    if (req.query.postId) filter._id = req.query.postId;
    if (req.query.searchTerm) {
      filter.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    const posts = await Post.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPost = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      message: "Posts fetched successfully",
      posts: posts,
      totalPost: totalPost,
      lastMonthPosts: lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};
