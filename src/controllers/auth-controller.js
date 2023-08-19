import bcrypt from "bcrypt";
import crypto from "crypto";

import pool from "../config/sql.js";
import { sendEmailConfirmation } from "../mail/edge.js";
import addUserSchema from "../schemas/add-user-schema.js";
import loginSchema from "../schemas/login-schema.js";

export const createUser = async (req, res) => {
  const { body } = req;

  try {
    const validator = await addUserSchema(body);
    const { value, error } = validator.validate(body);

    if (error) {
      return res.status(401).json(error.details);
    }

    const { email, password, backLink } = value;

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

    await sendEmailConfirmation(email, hash, backLink);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { body } = req;

  try {
    const validator = await loginSchema(body);
    const { value, error } = validator.validate(body);

    if (error) {
      return res.status(401).json(error.details);
    }

    const { email, password } = value;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];
    const compare = await bcrypt.compare(password, user.password);

    if (compare) {
      return res.status(200).json(user);
    }

    return res.status(402).json({ error: "invalid credentials" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const verifyUser = async (req, res) => {
  const { hash } = req.body;

  try {
    const emailVerify = await pool.query(
      "SELECT * FROM emailvalidation WHERE hash = $1",
      [hash]
    );

    if (emailVerify.rows.length === 0) {
      return res.status(402).json({ error: "Hash not found" });
    }

    await pool.query("UPDATE users SET verify = true WHERE email = $1", [
      emailVerify.rows[0].email,
    ]);

    await pool.query("DELETE FROM emailvalidation WHERE hash = $1", [hash]);
    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
