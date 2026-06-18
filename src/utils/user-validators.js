import Joi from "joi";
import { getOnlyErrorMessage } from "./cleanup-helpers.js";


export const profileUpdateValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).trim().lowercase(),
    age: Joi.number().integer().min(18).max(60),
    gender: Joi.string()
      .trim()
      .lowercase()
      .valid("male", "female", "others").messages({
        "any.only": "gender must be male or female or others"
      }),
    skills: Joi.array().items(Joi.string().min(1).max(30).trim().lowercase().messages({
        "string.empty": 'skill name is required',
        "string.min": "skill name is required",
        "string.max": "skill name cann't exceed 30 chars"
    })).max(10).message("maximum 10 skills are allowed")
  });

  const { error } = schema.validate(data);

  const errorMessage = getOnlyErrorMessage(error)
  return errorMessage
};

