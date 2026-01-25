import express from "express";
import * as fleetController from "./fleet.controller.js";
import * as fleetValidator from "./fleet.validator.js";

const router = express.Router();

router.get("/", fleetController.getAllTrucks);

router.post(
  "/",
  fleetValidator.validateBody(fleetValidator.createTruckSchema),
  fleetController.createTruck
);

router.put(
  "/:truckId",
  fleetValidator.validateBody(fleetValidator.updateTruckSchema),
  fleetController.updateTruck
);

router.delete(
  "/:id",
  fleetValidator.validateParams(fleetValidator.truckIdSchema),
  fleetController.deleteTruck
);

router.get(
  "/:id",
  fleetValidator.validateParams(fleetValidator.truckIdSchema),
  fleetController.getTruckById
);

router.get(
  "/routes/:route",
  fleetValidator.validateParams(fleetValidator.fleetRouteSchema),
  fleetController.getTrucksByRoute
);

router.patch(
  "/status/:truckId",
  fleetValidator.validateBody(fleetValidator.toggleStatusSchema),
  fleetController.toggleTruckStatus
);

export default router;
