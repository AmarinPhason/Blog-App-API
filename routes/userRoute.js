import express from "express";
import { updateUserCtrl } from "../controllers/userCtrl.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const userRouter = express.Router();
userRouter.put("/update", authMiddleware, updateUserCtrl);

export default userRouter;
