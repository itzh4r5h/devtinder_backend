import { CustomError } from "../middlewares/error-middleware.js"
import { User } from "../models/user-model.js"
import { profileCompletion } from "../utils/profileCompletion.js"
import { profileUpdateValidator } from "../utils/user-validators.js"




export const viewProfile = async (req, res) => {
  const user = { ...req.user._doc }
  const { profileCompletionCount } = profileCompletion(user)
  user.profileCompletionCount = profileCompletionCount
  res.status(200).json(user)
}

export const updateProfile = async (req, res) => {

  const errorMessage = profileUpdateValidator(req.body)

  if (errorMessage) {
    throw new CustomError(errorMessage, 400)
  }

  const user = await User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, returnDocument: 'after' })

  res.status(200).json({
    success: true,
    message: 'updated successfully',
    user
  })
}
