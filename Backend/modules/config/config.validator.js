import joi from "joi";

export const createConfigSchema = joi.object({
  deport_location: joi
    .object({ lat: joi.number().required(), lon: joi.number().required() })
    .unknown(false),
});

export const configTemplateSchema = joi.object({
  deport_location: joi
    .object({ lat: joi.number().required(), lon: joi.number().required() })
    .unknown(false),
  notification_template: joi.string().required().pattern(/\d/),
});

export const bodyValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    next();
  };
};
