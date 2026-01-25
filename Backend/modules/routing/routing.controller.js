import * as routingService from "./routing.service.js";
import { successResponse } from "../../util/response.js";

// No validations need
export async function generateRoutesAuto(req, res) {
  const routes = await routingService.generateRoutesAuto();
  return res.status(200).json(routes);
}

// No validations need
export async function generateRouteWiseAll(req, res) {
  const routes = await routingService.generateRouteWiseAll();
  return res.status(200).json(routes);
}

// Params validation done.
export async function generateRouteWise(req, res) {
  const routes = await routingService.generateRouteWise(req.params.route);
  return res.status(200).json(routes);
}

// Body validation done.
export async function dispatchRoutes(req, res) {
  console.log(req.body);

  await routingService.dispatchRoutes(req.body);
  successResponse(res, "Successfully dispatched", 201);
}

// Get route by ID
export async function getRouteById(req, res) {
  const route = await routingService.getRouteById(req.params.route_id);
  return res.status(200).json(route);
}

// Get all Pending Routes
export async function getPendingRoutesController(req, res) {
  const { driver_id } = req.params;
  const pendingRoutes = await routingService.getPendingRoutesService(driver_id);
  return res.status(200).json(pendingRoutes);
}

// Production pickup confirmation.
export async function confirmProductionPickup(req, res) {
  const { route_id, production_id, collectedVolume, driver_id } = req.body;

  const result = await routingService.confirmProductionPickup(
    route_id,
    production_id,
    driver_id,
    collectedVolume
  );

  return res.status(200).json({
    success: true,
    message: result.alreadyProcessed
      ? "Pickup already confirmed"
      : "Pickup confirmed",
  });
}

// Production issue report
export async function issuePickupReport(req, res) {
  const { route_id, production_id, driver_id, failureReason } = req.body;

  console.log(req.body);

  const result = await routingService.issuePickupReportService(
    route_id,
    production_id,
    driver_id,
    failureReason
  );

  return res.status(200).json({
    success: true,
    message: result.alreadyProcessed
      ? "Pickup already marked as failed"
      : "Pickup marked as failed",
  });
}

export async function cancelRouteActivation(req, res) {
  const route_id = req.params.route_id;

  await routingService.cancelRouteActivation(route_id);

  return res.status(200).json({
    success: true,
    message: "Route successfully restored",
  });
}

// This should be changed to route_id -> params. after JWT implemented
export async function activateRoute(req, res) {
  const { driver_id, route_id } = req.body;

  await routingService.activateRoute(driver_id, route_id);

  return res.status(200).json({
    success: true,
    message: "Successfully activated",
  });
}

// This must be change with JWT
export async function routeCompletetionController(req, res) {
  const route_id = req.params.route_id;
  const { driver_id } = req.body;

  await routingService.routeCompletetionService(route_id, driver_id);

  return res.status(200).json({
    success: true,
    message: "Marked as completed",
  });
}

// This must be change with JWT
export async function getCompletedRoutesController(req, res) {
  const driver_id = req.params.driver_id;
  const result = await routingService.getCompletedRoutesService(driver_id);
  successResponse(res, result, 200);
}

export async function getDispatchedController(req, res) {
  const result = await routingService.getDispatchedService();

  successResponse(res, result, 200);
}

export async function getInProgressController(req, res) {
  const result = await routingService.getInProgreeService();

  successResponse(res, result, 200);
}

export async function deleteRouteController(req, res) {
  const route_id = req.params.route_id;

  await routingService.deleteRouteService(route_id);

  successResponse(res, "Successfully deleted", 200);
}

export async function getHistoryController(req, res) {
  const result = await routingService.getHistoryService();

  successResponse(res, result, 200);
}
