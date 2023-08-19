import { addUserSchema } from "../schemas";

export const createUser = async (req, res) => {
  const { body } = req;

  try {
    const validator = await addUserSchema(body);
    const { value, error } = validator.validate(body);
  } catch (error) {}
};
