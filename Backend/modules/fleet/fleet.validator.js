import joi from "joi";

export const createTruckSchema = joi.object({
  license_no: joi.string().required(),
  capacity: joi.number().min(0).max(10000),
  model: joi.string().required(),
  distance_travelled: joi.number().min(0),
  route: joi.number().integer().min(1).max(6),
});

export const truckIdSchema = joi.object({
  id: joi.string().required(),
});

export const fleetRouteSchema = joi.object({
  route: joi.number().integer().min(1).max(6).required(),
});

export const updateTruckSchema = joi.object({
  license_no: joi.string().required(),
  capacity: joi.number().min(0).max(10000).required(),
  model: joi.string().required(),
  distance_travelled: joi.string().required(),
  route: joi.number().integer().min(1).max(6).required(),
});

export const statusTruckSchema = joi.object({
  body: joi.object({
    license_no: joi.string().required(),
    status: joi
      .string()
      .valid("available", "unavailable", "inService")
      .required(),
  }),
});

export const postTruckSchema = joi.object({
  body: joi.object({
    license_no: joi.string().required(),
    capacity: joi.number().min(0).max(2500),
    status: joi.string().valid("available", "unavailable", "inService"),
    model: joi.string().required(),
    distance_travelled: joi.string(),
    route: joi.number().integer().min(1).max(6),
  }),
});

export const toggleStatusSchema = joi.object({
  status: joi.string().valid("available", "unavailable").required(),
});

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
