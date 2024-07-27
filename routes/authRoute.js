import express from "express";
import { loginCtrl, registerCtrl } from "../controllers/authCtrl.js";

const authRouter = express.Router();
authRouter.post("/register", registerCtrl);
authRouter.post("/login", loginCtrl);

export default authRouter;
