import express from "express";
import { deleteUserCtrl, updateUserCtrl } from "../controllers/userCtrl.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const userRouter = express.Router();
userRouter.put("/update-user", authMiddleware, updateUserCtrl);
userRouter.delete("/delete-user", authMiddleware, deleteUserCtrl);

export default userRouter;
