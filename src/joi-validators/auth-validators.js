import Joi from "joi";
import { getOnlyErrorMessage } from "../utils/cleanup-helpers.js";

const passwordObj = {
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$",
      ),
    )
    .required()
    .messages({
      "string.empty": "password is required",
      "string.min": "password must be at least 8 characters",
      "string.max": "password cann't exceed 20 characters",
      "string.pattern.base":
        "password must have uppercase and lowercase letters, numbers and sepcial characters",
    }),
};

export const signupValidator = (data) => {

  const schema = Joi.object({
    username: Joi.string().alphanum().trim().min(5).max(10).required().messages({
      "string.empty": "username is required",
      "string.min": "username must be at least 5 characters",
      "string.max": "username cann't exceed 10 characters",
    }),
    name: Joi.string().min(3).max(30).required().trim().lowercase(),
    email: Joi.string().trim().lowercase().email().required(),
    ...passwordObj,
  });

  const { error } = schema.validate(data);

  const errorMessage = getOnlyErrorMessage(error);
  return errorMessage;
};

export const signinValidator = (data) => {

  const schema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    ...passwordObj,
  });

  const { error } = schema.validate(data);

  const errorMessage = getOnlyErrorMessage(error);
  return errorMessage;
};
