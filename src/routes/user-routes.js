import express from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import { updateProfile, updateProfilePic, viewProfile } from "../controllers/user-controller.js";
import { isAuthorized, isValidData } from "../middlewares/auth-middleware.js";
import { upload } from "../utils/uploadImage.js";

export const userRouter = express.Router();

userRouter.get("/me", isAuthorized, asyncHandler(viewProfile));
userRouter.patch('/edit', isAuthorized, isValidData, asyncHandler(updateProfile))
userRouter.patch('/pic', isAuthorized, upload.single('pic'), asyncHandler(updateProfilePic))
