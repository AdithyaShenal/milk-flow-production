import * as farmerRepository from "./farmer.repository.js";
import { cacheGet, cacheSet, cacheDel, delByPrefix } from "../../lib/redis.js";
import { PRODUCTION_KEYS, FARMER_KEYS, TTL } from "../../lib/cacheKeys.js";
import { ConflictError } from "../../errors/errors.js";

async function invalidateFarmerListCaches(route = null) {
  const deletes = [
    cacheDel(FARMER_KEYS.ALL_FARMERS),
    delByPrefix(FARMER_KEYS.SEARCH_PREFIX),
  ];
  if (route != null)
    deletes.push(cacheDel(FARMER_KEYS.FARMERS_BY_ROUTE(route)));
  await Promise.all(deletes);
}

async function invalidateFarmerCaches(farmer) {
  await Promise.all([
    cacheDel(FARMER_KEYS.FARMER_BY_ID(farmer._id)),
    cacheDel(FARMER_KEYS.FARMER_BY_NAME(farmer.name)),
    farmer.route != null
      ? cacheDel(FARMER_KEYS.FARMERS_BY_ROUTE(farmer.route))
      : Promise.resolve(),
    cacheDel(FARMER_KEYS.ALL_FARMERS),
    delByPrefix(FARMER_KEYS.SEARCH_PREFIX),
    cacheDel(PRODUCTION_KEYS.TODAY_BY_FARMER(farmer._id)),
    cacheDel(PRODUCTION_KEYS.HISTORY_BY_FARMER(farmer._id)),
    cacheDel(PRODUCTION_KEYS.BY_FARMER_ID(farmer._id)),
    cacheDel(PRODUCTION_KEYS.ALL_PENDING),
    farmer.route != null
      ? cacheDel(PRODUCTION_KEYS.BY_ROUTE(farmer.route))
      : Promise.resolve(),
  ]);
}

export async function searchFarmers({
  search = "",
  filterBy = "",
  route = "all",
}) {
  const key = FARMER_KEYS.SEARCH(route, filterBy, search);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const Farmer = (await import("./farmer.model.js")).default;
  const mongoose = await import("mongoose");

  const query = {};

  if (route !== "all") query.route = Number(route);
  if (search && filterBy === "name")
    query.name = { $regex: search, $options: "i" };
  if (search && filterBy === "address")
    query.address = { $regex: search, $options: "i" };
  if (search && filterBy === "id" && mongoose.Types.ObjectId.isValid(search))
    query._id = search;

  const farmers = await Farmer.find(query).sort({ createdAt: -1 });

  await cacheSet(key, farmers, TTL.FARMER_SEARCH);
  return farmers;
}

export async function createFarmer(data) {
  const existing = await farmerRepository.findByPhoneOrShortName(
    data.phone,
    data.shortName,
  );

  if (existing) {
    if (existing.phone === data.phone)
      throw new ConflictError("Phone number already exists");
    if (existing.shortName === data.shortName)
      throw new ConflictError("Username already exists");
  }

  const farmer = await farmerRepository.create(data);

  await invalidateFarmerListCaches(data.route);

  return farmer;
}

export async function getAllFarmers() {
  const key = FARMER_KEYS.ALL_FARMERS;

  const cached = await cacheGet(key);
  if (cached) return cached;

  const farmers = await farmerRepository.findAll();
  await cacheSet(key, farmers, TTL.ALL_FARMERS);
  return farmers;
}

export async function getFarmersById(id) {
  const key = FARMER_KEYS.FARMER_BY_ID(id);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const farmer = await farmerRepository.findById(id);
  if (!farmer) throw new Error("Farmer not found!");

  await cacheSet(key, farmer, TTL.FARMER_DETAIL);
  return farmer;
}

export async function getFarmersByName(name) {
  const key = FARMER_KEYS.FARMER_BY_NAME(name);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const farmers = await farmerRepository.findByName(name);
  if (!farmers || farmers.length === 0)
    throw new Error("No farmer found with this relevant name");

  await cacheSet(key, farmers, TTL.FARMER_DETAIL);
  return farmers;
}

export async function getFarmersByRoute(route) {
  const key = FARMER_KEYS.FARMERS_BY_ROUTE(route);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const farmers = await farmerRepository.findByRoute(route);
  if (!farmers || farmers.length === 0)
    throw new Error("No farmers found in this route");

  await cacheSet(key, farmers, TTL.FARMERS_BY_ROUTE);
  return farmers;
}

export async function updateFarmer(id, data) {
  const farmer = await farmerRepository.findById(id);
  if (!farmer) throw new Error("Farmer not found");

  const updated = await farmerRepository.update(id, data);

  await invalidateFarmerCaches(farmer);

  if (data.route != null && data.route !== farmer.route) {
    await Promise.all([
      cacheDel(FARMER_KEYS.FARMERS_BY_ROUTE(data.route)),
      cacheDel(PRODUCTION_KEYS.BY_ROUTE(data.route)),
    ]);
  }

  return updated;
}

export async function deleteFarmer(id) {
  const farmer = await farmerRepository.findById(id);
  if (!farmer) throw new Error("Farmer not found");

  const result = await farmerRepository.remove(id);

  await invalidateFarmerCaches(farmer);

  return result;
}
