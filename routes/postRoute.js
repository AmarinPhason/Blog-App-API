import express from "express";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/authMiddleware.js";
import { createPostCtrl, getPostCtrl } from "../controllers/postCtrl.js";
const postRouter = express.Router();

postRouter.post("/create-post", authMiddleware, createPostCtrl);
postRouter.get("/get-post", authMiddleware, getPostCtrl);

export default postRouter;
