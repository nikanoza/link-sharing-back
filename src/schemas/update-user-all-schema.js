import Joi from "joi";
import pool from "../config/sql.js";

const ifUserExist = (user) => (value, helpers) => {
  if (!user) {
    return helpers.message("user with this email not exist");
  }

  return value;
};

export const updateUserAllSchema = async (data) => {
  const user = await pool.query("SELECT * FROM users WHERE id = $1", [data.id]);

  return Joi.object({
    email: Joi.string().email().required().trim(),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    avatar: Joi.string().trim().required(),
    id: Joi.number().custom(ifUserExist(user.rows[0])).required(),
  });
};

export default updateUserAllSchema;
