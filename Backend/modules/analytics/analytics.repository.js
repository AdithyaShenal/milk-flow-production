import Route from "../routing/routing.model.js";
import Production from "../production/production.model.js";
import Trucks from "../fleet/fleet.model.js";
import RouteConfig from "../routing/routing.config.model.js";

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

// Output
// [
//   { route: 1, totalVolume: 1200 },
//   { route: 2, totalVolume: 980 },
//   { route: 3, totalVolume: 1500 }
// ]

export async function getProductionSumByRoute() {
  const result = await Production.aggregate([
    {
      $match: {
        status: "pending",
        blocked: false,
      },
    },
    {
      $group: {
        _id: "$farmer.route",
        totalVolume: { $sum: "$volume" },
      },
    },
    {
      $project: {
        _id: 0, // remove _id
        route: "$_id", // create new field and assign _id
        totalVolume: 1, // Keep as it is
      },
    },
    {
      $sort: { route: 1 },
    },
  ]);

  return result;
}

// Output
// [
//   { route: 1, totalCapacity: 5000 },
//   { route: 2, totalCapacity: 3200 },
//   { route: 3, totalCapacity: 4500 }
// ]

export async function getTruckCapacityByRoute() {
  const result = await Trucks.aggregate([
    {
      $match: {
        status: "available",
        route: { $exists: true },
      },
    },
    {
      $group: {
        _id: "$route",
        totalCapacity: { $sum: "$capacity" },
      },
    },
    {
      $project: {
        _id: 0,
        route: "$_id",
        totalCapacity: 1,
      },
    },
    {
      $sort: { route: 1 },
    },
  ]);

  return result;
}
