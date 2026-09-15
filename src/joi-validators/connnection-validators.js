import Joi from "joi";
import mongoose from "mongoose";
import { getOnlyErrorMessage } from "../utils/cleanup-helpers.js";

const validateMongoId = (id, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return helpers.error("any.invalid");
  }
  return id;
};

const idObj = {
  id: Joi.string()
    .trim()
    .lowercase()
    .required()
    .custom(validateMongoId)
    .messages({
      "any.invalid": "invalid id",
    }),
};

export const connectionReqValidator = (data) => {
  const { status, id, isSendReq } = data;
  const sendStatus = ["interested", "ignored"];
  const reviewStatus = ["accepted", "rejected"];
  const finalStatus = isSendReq ? sendStatus : reviewStatus;

  const schema = Joi.object({
    status: Joi.string()
      .required()
      .valid(...finalStatus)
      .messages({
        "any.only": "invalid status",
      }),
    ...idObj,
  });

  const { error } = schema.validate({ status, id });

  const errorMessage = getOnlyErrorMessage(error);
  return errorMessage;
};
