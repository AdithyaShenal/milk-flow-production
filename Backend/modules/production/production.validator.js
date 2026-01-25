import Joi from "joi";

export const submitProductionSchema = Joi.object({
  volume: Joi.number().min(0).required(),
});

export const blockProductionSchema = Joi.object({
  body: Joi.object({
    status: Joi.string().valid("blocked").required(),
  }),
});

export const farmerIdSchema = Joi.object({
  params: Joi.object({
    farmer_id: Joi.string().required(),
  }),
});

export const productionRouteSchema = Joi.object({
  params: Joi.object({
    route: Joi.number().integer().min(1).max(6).required(),
  }),
});
