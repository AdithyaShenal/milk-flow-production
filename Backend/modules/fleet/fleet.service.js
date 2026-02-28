import * as fleetRepository from "./fleet.repository.js";
import * as errors from "../../errors/errors.js";
import { cacheGet, cacheSet, cacheDel, delByPrefix } from "../../lib/redis.js";
import { FLEET_KEYS, TTL } from "../../lib/cacheKeys.js";

async function invalidateFleetListCaches() {
  await Promise.all([
    cacheDel(FLEET_KEYS.ALL_TRUCKS),
    delByPrefix(FLEET_KEYS.SEARCH_PREFIX),
  ]);
}

async function invalidateTruckCaches(truck) {
  await Promise.all([
    cacheDel(FLEET_KEYS.TRUCK_BY_ID(truck._id)),
    cacheDel(FLEET_KEYS.TRUCK_BY_LICENSE(truck.license_no)),
    truck.route != null
      ? cacheDel(FLEET_KEYS.TRUCKS_BY_ROUTE(truck.route))
      : Promise.resolve(),
    delByPrefix(FLEET_KEYS.SEARCH_PREFIX),
  ]);
}

export async function searchTrucks({
  search = "",
  filterBy = "",
  status = "all",
}) {
  const key = FLEET_KEYS.SEARCH(status, filterBy, search);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const Truck = (await import("./fleet.model.js")).default;
  const mongoose = await import("mongoose");

  const query = {};

  if (status !== "all") query.status = status;
  if (search && filterBy === "model")
    query.model = { $regex: search, $options: "i" };
  if (search && filterBy === "license_no")
    query.license_no = { $regex: search, $options: "i" };
  if (search && filterBy === "id" && mongoose.Types.ObjectId.isValid(search))
    query._id = search;

  const trucks = await Truck.find(query).sort({ createdAt: -1 });

  await cacheSet(key, trucks, TTL.FLEET_SEARCH);
  return trucks;
}

export async function getfleet() {
  const key = FLEET_KEYS.ALL_TRUCKS;

  const cached = await cacheGet(key);
  if (cached) return cached;

  const trucks = await fleetRepository.findAll();
  if (!trucks || trucks.length === 0)
    throw new errors.NotFoundError("Trucks not found");

  await cacheSet(key, trucks, TTL.ALL_TRUCKS);
  return trucks;
}

export async function getTruckById(id) {
  const key = FLEET_KEYS.TRUCK_BY_ID(id);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const truck = await fleetRepository.findTruckById(id);
  if (!truck) throw new errors.NotFoundError("Truck not found");

  await cacheSet(key, truck, TTL.TRUCK_DETAIL);
  return truck;
}

export async function findTruckByLicenseNo(license_no) {
  const key = FLEET_KEYS.TRUCK_BY_LICENSE(license_no);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const truck = await fleetRepository.findTruckByLicenseNo(license_no);
  if (!truck) throw new errors.NotFoundError("Truck not found");

  await cacheSet(key, truck, TTL.TRUCK_DETAIL);
  return truck;
}

export async function getTrucksByRoute(route) {
  const key = FLEET_KEYS.TRUCKS_BY_ROUTE(route);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const trucks = await fleetRepository.findTrucksByRoute(route);
  if (!trucks || trucks.length === 0)
    throw new errors.NotFoundError("Fleet not found");

  await cacheSet(key, trucks, TTL.TRUCKS_BY_ROUTE);
  return trucks;
}

export async function createTruck(data) {
  const existing = await fleetRepository.findTruckByLicenseNo(data.license_no);
  if (existing) throw new errors.BadRequestError("Truck already exists");

  const truck = await fleetRepository.create(data);

  await invalidateFleetListCaches();

  return truck;
}

export async function updateTruck(id, data) {
  const truck = await fleetRepository.findTruckById(id);
  if (!truck) throw new errors.NotFoundError("Truck not found");

  const updated = await fleetRepository.update(id, data);

  await Promise.all([
    invalidateTruckCaches(truck),
    invalidateFleetListCaches(),
  ]);

  return updated;
}

export async function deleteTruck(id) {
  const truck = await fleetRepository.findTruckById(id);
  if (!truck) throw new errors.NotFoundError("Truck not found");

  const result = await fleetRepository.delete_Truck(id);

  await Promise.all([
    invalidateTruckCaches(truck),
    invalidateFleetListCaches(),
  ]);

  return result;
}

export async function toggleTruckStatus(truckId, status) {
  const truck = await fleetRepository.findTruckById(truckId);
  if (!truck) throw new errors.NotFoundError("Truck with given ID not found");

  if (truck.status === "onDuty") {
    throw new errors.ValidationError(
      "Cannot change status while truck is on duty",
    );
  }

  const updated = await fleetRepository.toggleStatus(truckId, status);

  await Promise.all([
    invalidateTruckCaches(truck),
    invalidateFleetListCaches(),
  ]);

  return updated;
}
