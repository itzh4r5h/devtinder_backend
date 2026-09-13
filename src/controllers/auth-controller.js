import { CustomError } from "../middlewares/error-middleware.js";
import { User } from "../models/user-model.js";
import { signinValidator, signupValidator } from "../utils/auth-validators.js";
import { profileCompletion } from "../utils/profileCompletion.js";

const setTokenInCookie = (user, res) => {
  const token = user.generateJWT();

  const ONE_MIN = 60 * 1000;
  const ONE_HOUR = 60 * ONE_MIN;
  const ONE_DAY = 24 * ONE_HOUR;

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: ONE_DAY,
  });
};

const removePasswordFromUser = (user) => {
  const userData = user.toObject();
  delete userData.password;

  return userData;
};

export const signup = async (req, res) => {
  const { username, name, email, password } = req.body;

  // will get either error message or undefined
  const errorMessage = signupValidator({ username, name, email, password });

  if (errorMessage) {
    throw new CustomError(errorMessage, 400);
  }

  const user = await User.create({ username, name, email, password });

  const userData = removePasswordFromUser(user);
  const { profileCompletionCount } = profileCompletion(userData)
  userData.profileCompletionCount = profileCompletionCount

  setTokenInCookie(user, res);
  res.status(201).json({
    success: true,
    message: 'signed up successfully',
    user: userData
  });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  const errorMessage = signinValidator({ email, password });

  if (errorMessage) {
    throw new CustomError(errorMessage, 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError("invalid credentials", 401);
  }

  const isPasswordValid = await user.verifyPassword(password);

  if (!isPasswordValid) {
    throw new CustomError("invalid credentials", 401);
  }

  const userData = removePasswordFromUser(user);
  const { profileCompletionCount } = profileCompletion(userData)
  userData.profileCompletionCount = profileCompletionCount

  setTokenInCookie(user, res);
  res.status(200).json({
    success: true,
    message: 'signed in successfully',
    user: userData
  });
};

export const signout = async (req, res) => {
  res.clearCookie('token', { httpOnly: true })

  res.status(200).json({
    success: true,
    message: 'signed out successfully'
  })
}
