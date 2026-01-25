import { ValidationError } from "../../errors/errors.js";

export default function validate(schema, property = "body") {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
    next();
  };
}
