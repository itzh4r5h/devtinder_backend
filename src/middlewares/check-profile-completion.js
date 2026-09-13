import { profileCompletion } from "../utils/profileCompletion"
import { CustomError } from "./error-middleware"

export const checkProfileCompletion = async (req, res, next) => {
  const { isProfileCompleted } = profileCompletion(req.user)
  if (!isProfileCompleted) {
    throw new CustomError("please, complete your profile first", 403)
  }
  next()
}
