import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
});
export const singinSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
});