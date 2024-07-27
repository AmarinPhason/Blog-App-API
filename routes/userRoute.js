import express from "express";
import { registerCtrl } from "../controllers/authCtrl.js";

const userRouter = express.Router();
userRouter.post("/register", registerCtrl);

export default userRouter;
