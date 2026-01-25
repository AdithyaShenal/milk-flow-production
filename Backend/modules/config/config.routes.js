import * as configController from "./config.controller.js";
import * as configValidator from "./config.validator.js";
import express from "express";

const router = express.Router();

// Get all configs
router.get("/", configController.getConfig);

// Update depot location
router.patch("/map", configController.updateDepotLocation);

// Get depot location individually
router.get("/depotLocation", configController.getDepotLocation);

router.post(
  "/",
  configValidator.bodyValidator(configValidator.createConfigSchema),
  configController.create
);

router.patch(
  "/",
  configValidator.bodyValidator(configValidator.configTemplateSchema),
  configController.updateNotification
);

router.patch(
  "/",
  configValidator.bodyValidator(configValidator.configLat_Fat_TableSchema),
  configController.updateLat_Fat_Table
);

export default router;
