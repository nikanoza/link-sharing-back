import pool from "../config/sql.js";
import updateUserAllSchema from "../schemas/update-user-all-schema.js";

export const updateUserWithAvatar = async (req, res) => {
  const { body, params, file } = req;
  const { id } = params;

  try {
    if (!file) {
      return res.status(402).json({ message: "image did not upload" });
    }
    const avatar = "/storage/" + file.filename;
    const validator = await updateUserAllSchema({ ...body, avatar, id });
    const { value, error } = validator.validate({ ...body, avatar, id });

    if (error) {
      return res.status(401).json(error.details);
    }

    const { firstName, lastName, email } = value;
    await pool.query(
      "UPDATE users SET firstname = $1, lastname = $2, email = $3, image = $4 WHERE id = $5",
      [firstName, lastName, email, avatar, id]
    );

    return res.status(204).json({ message: "user updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
