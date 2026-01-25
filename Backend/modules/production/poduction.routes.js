import express from "express";
import * as productionController from "./production.controller.js";
import * as productionValidator from "./production.validator.js";
import validate from "../middleware/validate.js";

import farmerAuth from "../user/farmer/farmer.auth.js";

const router = express.Router();

// Submit daily production by farmer)-------------------- farmer application purpose
router.post(
  "/",
  farmerAuth,
  validate(productionValidator.submitProductionSchema),
  productionController.submitProduction
);

// Update submitted production
router.put(
  "/:production_id",
  farmerAuth,
  productionController.updateProductionController
);

// Delete submitted production
router.delete(
  "/:production_id",
  farmerAuth,
  productionController.deleteProductionController
);

// Fetch today production by farmer
router.get("/today", farmerAuth, productionController.getMyProductionToday);

// Get farmer collected/failed production
router.get("/me", farmerAuth, productionController.getMyProductions);

// ------------------------------------------------------ farmer application purpose

router.get("/", productionController.getProductions);

// Fetch all pending productions
router.get("/pending/all", productionController.getAllPendingProductions);

// Hold a production
router.patch("/block/:productionId", productionController.blockProduction);

// Fetch production by farmer id
router.get(
  "/farmer/:farmer_id",
  validate(productionValidator.farmerIdSchema),
  productionController.getProductionsByFarmerId
);

// Fetch productions by route no
router.get(
  "/route/:route",
  validate(productionValidator.productionRouteSchema),
  productionController.getProductionsByRoute
);

export default router;
