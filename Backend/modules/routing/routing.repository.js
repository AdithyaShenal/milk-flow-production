import Production from "../production/production.model.js";
import Route from "./routing.model.js";
import Trucks from "../fleet/fleet.model.js";
import mongoose from "mongoose";
import Config from "../config/config.model.js";

export async function getPendingProduction() {
  return await Production.find({ blocked: false, status: "pending" });
}

export async function saveRoutes(routes) {
  try {
    await Route.insertMany(routes);
  } catch (err) {
    throw new Error("Failed to save routes: " + err.message);
  }
}

export async function getPendingProductionByRoute(route) {
  return await Production.find({
    blocked: false,
    status: "pending",
    "farmer.route": route,
  });
}

export async function getPendingRoutesRepo(driver_id) {
  const pendingRoutes = await Route.find({
    $or: [
      { status: "dispatched" },
      {
        status: "inProgress",
        driver_id: new mongoose.Types.ObjectId(driver_id),
      },
    ],
  });

  return pendingRoutes;
}

export async function getRouteById(route_id) {
  const pendingRoute = await Route.findById(route_id);
  return pendingRoute || null;
}

export async function saveRoute(route) {
  return await route.save();
}

export async function updateProductionState(production_id, status) {
  return await Production.findByIdAndUpdate(
    production_id,
    { status: status },
    { new: true }
  );
}

export async function bulkUpdateProductionsToAwaiting(productionIds) {
  return await Production.updateMany(
    { _id: { $in: productionIds } },
    {
      $set: {
        status: "awaiting pickup",
        failure_reason: "-",
        collectedVolume: 0,
      },
    }
  );
}

export async function bulkUpdateProductionToPending(productionIds) {
  return await Production.updateMany(
    { _id: { $in: productionIds } },
    {
      $set: {
        status: "pending",
        failure_reason: "-",
        collectedVolume: 0,
      },
    }
  );
}

export async function updateProductionOnPickup(
  route_id,
  production_id,
  driver_id,
  collectedVolume
) {
  const route = await Route.findOneAndUpdate(
    {
      _id: route_id,
      active: true,
      driver_id: driver_id,
      "stops.production._id": production_id,
      "stops.production.status": { $ne: "collected" },
    },
    {
      $set: {
        "stops.$.production.status": "collected",
        "stops.$.production.collectedVolume": collectedVolume,
      },
    },
    {
      new: true,
      projection: { _id: 1 },
    }
  );

  return route;
}

export async function getCompletedRoutesByDriver(driver_id) {
  const routes = await Route.find({
    driver_id: driver_id,
    active: false,
    status: "completed",
  });

  return routes;
}

export async function getDispatchedRoutes() {
  const result = await Route.find({ status: "dispatched" });

  if (!result || result.length == 0) return [];

  return result;
}

export async function getInProgressRoutes() {
  const result = await Route.find({ status: "inProgress" });

  if (!result || result.length == 0) return [];

  return result;
}

export async function deleteRouteRepository(route_id) {
  const result = await Route.findByIdAndDelete(route_id);

  return result;
}

export async function getCompletedAndCanceledRoutes() {
  const result = await Route.find({
    status: { $in: ["completed", "canceled"] },
  });

  return result;
}

export async function getAllAvailableTrucks() {
  const trucks = await Trucks.find({
    status: "available",
  });

  return trucks;
}

export async function getAllAvailableTrucksByRoute(route) {
  const trucks = await Trucks.find({
    route: route,
  });

  return trucks;
}

export async function getTotalPendingProduction() {
  const result = await Production.aggregate([
    {
      $match: {
        status: "pending",
        blocked: false,
      },
    },
    {
      $group: {
        _id: null, // no grouping by field
        totalVolume: { $sum: "$volume" },
      },
    },
  ]);

  // If no matching documents, result will be []
  const totalPendingProductionVolume = result[0]?.totalVolume || 0;

  return totalPendingProductionVolume;
}

export async function getTotalTruckCapacity() {
  const result = await Trucks.aggregate([
    {
      $match: {
        status: "available",
      },
    },
    {
      $group: {
        _id: null,
        totalCapacity: { $sum: "$capacity" },
      },
    },
  ]);

  const totalAvailableTruckCapacity = result[0]?.totalCapacity || 0;

  return totalAvailableTruckCapacity;
}

export async function getDepotLocation() {
  const config = await Config.findOne();

  const depotLocation = config.depot_location;

  return depotLocation;
}
