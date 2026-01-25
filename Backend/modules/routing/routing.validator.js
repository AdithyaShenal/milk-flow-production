import Joi from "joi";
import joiObjectId from "joi-objectid";

Joi.objectId = joiObjectId(Joi);

export const routeIdSchema = Joi.object({
  route_id: Joi.objectId(),
});

export const driverIdSchema = Joi.object({
  driver_id: Joi.objectId(),
});

const qualitySchema = Joi.object({
  fat: Joi.number().optional(),
  lat: Joi.number().optional(),
  density: Joi.number().optional(),
  water_ratio: Joi.number().optional(),
}).optional();

const farmerSchema = Joi.object({
  _id: Joi.objectId().required(),
  name: Joi.string().min(1).max(64).required(),
  location: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required(),
  }).required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
  route: Joi.number().required(),
  shortName: Joi.string().optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

const productionSchema = Joi.object({
  _id: Joi.objectId().required(),
  farmer: farmerSchema.required(),
  volume: Joi.number().min(0).required(),
  status: Joi.string()
    .valid("pending", "awaiting pickup", "collected", "failed")
    .required(),
}).allow(null); // production can be null

const stopSchema = Joi.object({
  order: Joi.number().min(1).required(),
  node: Joi.number().required(),
  production: productionSchema, // allow null
  load_after_visit: Joi.number().min(0).required(),
});

export const dispatchRoutesSchema = Joi.array()
  .items(
    Joi.object({
      vehicle_id: Joi.objectId().optional(), // Number in your DB
      model: Joi.string().optional(),
      driver_id: Joi.objectId().optional(),
      license_no: Joi.string().required(),
      stops: Joi.array().items(stopSchema).min(1).required(),
      load: Joi.number().min(0).required(),
      distance: Joi.number().min(0).required(),
      status: Joi.string()
        .valid("dispatched", "completed", "canceled", "inProgress")
        .optional(),
      activatedAt: Joi.date().optional(),
    })
  )
  .min(1)
  .required();

export const confirmProductionSchema = Joi.object({
  route_id: Joi.objectId().required(),
  production_id: Joi.objectId().required(),
  driver_id: Joi.objectId().required(),
  collectedVolume: Joi.number().min(0).required(),
});

export const issuePickupReportSchema = Joi.object({
  route_id: Joi.objectId().required(),
  production_id: Joi.objectId().required(),
  driver_id: Joi.objectId().required(),
  failureReason: Joi.string().required(),
});

export const routeActivateSchema = Joi.object({
  route_id: Joi.objectId().required(),
  driver_id: Joi.objectId().required(),
});

export const routeCompletionDriverSchema = Joi.object({
  driver_id: Joi.objectId().required(),
});
