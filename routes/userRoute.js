import express from "express";
import {
  deleteUserCtrl,
  getUserCtrl,
  updateToAdmin,
  updateUserCtrl,
} from "../controllers/userCtrl.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const userRouter = express.Router();
userRouter.put("/update-user", authMiddleware, updateUserCtrl);
userRouter.delete("/delete-user", authMiddleware, deleteUserCtrl);
userRouter.get("/get-user", authMiddleware, getUserCtrl);
userRouter.put("/update-to-admin", authMiddleware, updateToAdmin);

export default userRouter;
