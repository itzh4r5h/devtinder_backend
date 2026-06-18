import jwt from "jsonwebtoken";
import { CustomError } from "./error-middleware.js";
import { User } from "../models/user-model.js";

export const isAuthorized = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new CustomError("invalid session, please signin!", 401);
  }

  const { id } = jwt.verify(token, "my_secret_key_comes_here");

  const user = await User.findById(id);

  if (!user) {
    throw new CustomError("invalid session, please signin!", 401);
  }

  req.user = user;

  next();
};

// only for post, put and patch requests
export const isValidData = async (req, res, next) => {
  // it will check whether req.body is defined or not
  // if defined get all the keys
  // keys like - ["name", "age"]
  // if keys are 0 then throw error
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new CustomError("invalid data", 400);
  }
  next();
};
