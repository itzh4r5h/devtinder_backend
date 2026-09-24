import { CustomError } from "./error-middleware.js"

export const checkProfileCompletion = async (req, res, next) => {
  if (!req.user.isProfileCompleted) {
    throw new CustomError("please, complete your profile first", 403)
  }
  next()
}
