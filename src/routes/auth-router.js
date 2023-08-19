import express from "express";
import { createUser, verifyUser } from "../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post("/register", createUser);
authRouter.post("/verify", verifyUser);

export default authRouter;
