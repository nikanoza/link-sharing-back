import bcrypt from "bcrypt";
import crypto from "crypto";
import { addUserSchema } from "../schemas";
import pool from "../config/sql.js";

export const createUser = async (req, res) => {
  const { body } = req;

  try {
    const validator = await addUserSchema(body);
    const { value, error } = validator.validate(body);

    if (error) {
      return res.status(401).json(error);
    }

    const { email, password } = value;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );

    const hash = crypto.randomBytes(48).toString("hex");

    await pool.query(
      "INSERT INTO emailvalidation (email, hash) VALUES ($1, $2)",
      [email, hash]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(401).json(error);
  }
};
