import express from "express";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/authMiddleware.js";
import { createPostCtrl } from "../controllers/postCtrl.js";
const postRouter = express.Router();

postRouter.post(
  "/create-post",
  authMiddleware,
  adminMiddleware,
  createPostCtrl
);

export default postRouter;
