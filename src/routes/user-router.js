import express from "express";
import multer from "multer";
import { updateUserWithAvatar } from "../controllers/user-controller.js";

const userRouter = express.Router();

export const fileStorage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, "public/storage");
  },
  filename: (_, file, callback) => {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const name = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    callback(null, timestamp + name);
  },
});

export const fileFilter = (__, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

userRouter.put(
  "/users/all/:id",
  multer({ storage: fileStorage, fileFilter }).single("avatar"),
  updateUserWithAvatar
);

export default userRouter;
