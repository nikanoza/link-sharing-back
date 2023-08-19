import Joi from "joi";
import pool from "../config/sql.js";

const ifUserExist = (user) => (value, helpers) => {
  if (!user) {
    return helpers.message("user with this email not exist");
  }

  return value;
};

export const loginSchema = async (data) => {
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    data.email,
  ]);

  return Joi.object({
    email: Joi.string()
      .email()
      .custom(ifUserExist(user.rows[0]))
      .required()
      .trim(),
    password: Joi.string().trim().required(),
  });
};

export default loginSchema;
