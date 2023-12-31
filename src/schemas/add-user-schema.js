import Joi from "joi";
import pool from "../config/sql.js";

const ifUserExist = (user) => (value, helpers) => {
  if (user) {
    return helpers.message("user with this email already exist");
  }

  return value;
};

export const addUserSchema = async (data) => {
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    data.email,
  ]);

  return Joi.object({
    email: Joi.string()
      .email()
      .custom(ifUserExist(user.rows[0]))
      .required()
      .trim(),
    password: Joi.string().trim().min(8).max(15).required(),
    backLink: Joi.string().uri().trim().required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });
};

export default addUserSchema;
