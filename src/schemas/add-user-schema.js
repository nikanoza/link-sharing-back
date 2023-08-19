import Joi from "joi";

export const addUserSchema = async (data) => {
  return Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().trim().min(5).max(10).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });
};

export default addUserSchema;
