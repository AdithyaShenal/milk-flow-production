import express from "express";
import * as farmerController from "./farmer.controller.js";
import * as farmerValidator from "./farmer.validator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/",
  validate(farmerValidator.createFarmerSchema),
  farmerController.createFarmer
);

router.get("/", farmerController.getAllFarmers);

// For testing
router.get("/all", farmerController.getAll);

router.get(
  "/:id",
  validate(farmerValidator.farmerIdSchema),
  farmerController.getFarmersById
);

router.get(
  "/name/:name",
  validate(farmerValidator.farmerNameSchema),
  farmerController.getFarmersByName
);

router.get(
  "/route/:route",
  validate(farmerValidator.farmerRouteSchema),
  farmerController.getFarmersByRoute
);

router.put(
  "/:id",
  validate(farmerValidator.updateFarmerSchema),
  farmerController.updateFarmer
);

router.delete(
  "/:id",
  validate(farmerValidator.farmerIdSchema),
  farmerController.deleteFarmer
);

export default router;
