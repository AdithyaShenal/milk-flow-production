import express from "express";
import {
  generateRoutesAuto,
  generateRouteWiseAll,
  dispatchRoutes,
  generateRouteWise,
  getPendingRoutesController,
  getRouteById,
  confirmProductionPickup,
  cancelRouteActivation,
  activateRoute,
  issuePickupReport,
  routeCompletetionController,
  getCompletedRoutesController,
  getDispatchedController,
  getInProgressController,
  deleteRouteController,
  getHistoryController,
} from "./routing.controller.js";

import * as routeValidator from "./routing.validator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// Admin Request VRP Auto Solution (Optimized Paths)
router.get("/optimize/auto", generateRoutesAuto);

// Admin Request VRP Route-Wise Solution For All Routes (Optimized Paths)
router.get("/optimize/route-wise/all", generateRouteWiseAll);

// Admin Request VRP Route-Wise Solution Using Route ID (Optimized Paths)
router.get("/optimize/route-wise/:route", generateRouteWise);

// Dispatch Generated Routes (Handle Idemponency)
router.post(
  "/dispatch",
  // validate(routeValidator.dispatchRoutesSchema),
  dispatchRoutes
);

// Get a Pending Route by ID
router.get(
  "/routes/:route_id",
  validate(routeValidator.routeIdSchema, "params"),
  getRouteById
);

// Get all Pending Routes (Driver App)
router.get(
  "/routes/pending_routes/:driver_id",
  validate(routeValidator.driverIdSchema, "params"),
  getPendingRoutesController
);

// Confirm pickup (Handle Idemponency Done) Checked
router.post(
  "/routes/confirm",
  validate(routeValidator.confirmProductionSchema),
  confirmProductionPickup
);

// issue a report about pickup
router.post(
  "/routes/pickup/report",
  validate(routeValidator.issuePickupReportSchema),
  issuePickupReport
);

// Route cancel & Exit (Handle Idemponency)
router.post(
  "/routes/cancel/:route_id",
  validate(routeValidator.routeIdSchema, "params"),
  cancelRouteActivation
);

// Route activation (Handle Idemponency Done) Checked
router.post(
  "/routes/activate",
  validate(routeValidator.routeActivateSchema),
  activateRoute
);

// Route Completetion
router.post(
  "/routes/complete/:route_id",
  validate(routeValidator.routeIdSchema, "params"),
  validate(routeValidator.routeCompletionDriverSchema),
  routeCompletetionController
);

// Get all the completed routes of drivers
router.get(
  "/routes/driver/:driver_id",
  validate(routeValidator.driverIdSchema, "params"),
  getCompletedRoutesController
);

// Routing CRUD ----------------------------------------------------

// Routing (All dispatched routes) (No validations)
router.get("/dispatch", getDispatchedController);

// Routing (All in progress routes)
router.get("/in_progress", getInProgressController);

// Delete a route by id
router.delete(
  "/routes/:route_id",
  validate(routeValidator.routeIdSchema, "params"),
  deleteRouteController
);

// Get all "completed" and "canceled"
router.get("/history", getHistoryController);

export default router;
