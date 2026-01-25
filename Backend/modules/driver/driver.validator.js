import joi from "joi";

export const driverIdSchema = joi.object({
  id: joi.string().required(),
});

export const createDriverSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().pattern(/^\d{10}$/),
  driver_license_no: joi.string().required(),
  status: joi.string().valid("available", "unavailable", "onDuty").optional(),
  shortName: joi.string().required(),
});

export const updateDriverSchema = joi.object({
  name: joi.string(),
  phone: joi.string().pattern(/^\d{10}$/),
  driver_license_no: joi.string().required(),
  status: joi.string().valid("available", "unavailable", "onDuty").optional(),
});

export const toggleStatusSchema = joi.object({
  status: joi.string().valid("available", "unavailable").required(),
});

// middleware/validate.js
export const bodyValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    next();
  };
};

export const paramsValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    next();
  };
};
