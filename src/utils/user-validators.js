import Joi from "joi";
import { getOnlyErrorMessage } from "./cleanup-helpers.js";


export const profileUpdateValidator = (data) => {
  const schema = Joi.object({

    name: Joi.string().trim().min(3).max(20).lowercase().required().messages({
      "string.empty": "name is required",
      "string.min": "name must be at least 3 characters",
      "string.max": "name cann't exceed 20 characters",
    }),
    gender: Joi.string().trim().lowercase().required().valid("male", "female", "others").messages({
      "any.only": "gender must be male or female or others"
    }),
    age: Joi.number().integer().min(11).max(100).required(),
    role: Joi.string().trim().min(2).max(40).lowercase().required().messages({
      "string.empty": "role is required",
      "string.min": "role must be at least 2 characters",
      "string.max": "role cann't exceed 40 characters",
    }),
    experience: Joi.string().trim().lowercase().required().valid('beginner', 'intermediate', 'advanced', 'expert').messages({
      "any.only": "experience must be beginner or intermediate or advanced or expert",
    }),
    description: Joi.string().trim().min(50).max(500).lowercase().required().messages({
      "string.empty": "description is required",
      "string.min": "description must be at least 50 characters",
      "string.max": "description cann't exceed 500 characters",
    }),
    tags: Joi.array().items(Joi.string().min(1).max(30).trim().lowercase().messages({
      "string.empty": 'tag name is required',
      "string.min": "tag name is required",
      "string.max": "tag name cann't exceed 30 chars",
    })).min(1)
      .max(15)
      .messages({
        "array.min": "at least one tag is required",
        "array.max": "maximum 15 tags are allowed",
      }),
    socials: Joi.object({
      github: Joi.string().trim().min(1).max(40).lowercase().required().messages({
        "any.required": "github username is required",
        "string.empty": "github username is required",
        "string.min": "github username must be at least 1 characters",
        "string.max": "github username cann't exceed 40 characters",
      }),
      linkedin: Joi.string().trim().min(3).max(100).lowercase().required().messages({
        "any.required": "linkedin username is required",
        "string.empty": "linkedin username is required",
        "string.min": "linkedin username must be at least 3 characters",
        "string.max": "linkedin username cann't exceed 100 characters",
      }),
      x: Joi.string().trim().min(1).max(15).lowercase().required().messages({
        "any.required": "x username is required",
        "string.empty": "x username is required",
        "string.min": "x username must be at least 1 characters",
        "string.max": "x username cann't exceed 15 characters",
      }),
    }).required()
  });

  const { error } = schema.validate(data);

  const errorMessage = getOnlyErrorMessage(error)
  return errorMessage
};

