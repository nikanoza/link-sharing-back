import express from "express";
import {
  createUser,
  login,
  verifyUser,
} from "../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post("/register", createUser);
authRouter.post("/verify", verifyUser);
authRouter.post("/login", login);

export default authRouter;
