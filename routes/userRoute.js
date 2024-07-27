import express from "express";
import { loginCtrl, registerCtrl } from "../controllers/authCtrl.js";

const userRouter = express.Router();
userRouter.post("/register", registerCtrl);
userRouter.post("/login", loginCtrl);

export default userRouter;
