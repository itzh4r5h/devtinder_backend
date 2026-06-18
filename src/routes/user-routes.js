import express from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import { updateProfile, viewProfile } from "../controllers/user-controller.js";
import { isAuthorized, isValidData } from "../middlewares/auth-middleware.js";

export const userRouter = express.Router();

userRouter.get("/me", isAuthorized, asyncHandler(viewProfile));
userRouter.patch('/edit', isAuthorized, isValidData, asyncHandler(updateProfile))