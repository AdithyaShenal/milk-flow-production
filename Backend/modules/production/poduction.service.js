import * as productionRepository from "./production.repository.js";
import mongoose from "mongoose";
import Production from "./production.model.js";
import Route from "../routing/routing.model.js";
import * as errors from "../../errors/errors.js";
import _ from "lodash";
import * as farmerRepo from "../farmer/farmer.repository.js";
import { cacheGet, cacheSet, cacheDel, delByPrefix } from "../../lib/redis.js";
import { getRedisClient } from "../../lib/redisClient.js";
import { PRODUCTION_KEYS, TTL } from "../../lib/cacheKeys.js";

async function invalidateProductionCaches(farmer_id, production_route = null) {
  const deletes = [
    cacheDel(PRODUCTION_KEYS.ALL_PENDING),
    cacheDel(PRODUCTION_KEYS.TODAY_BY_FARMER(farmer_id)),
    cacheDel(PRODUCTION_KEYS.HISTORY_BY_FARMER(farmer_id)),
    cacheDel(PRODUCTION_KEYS.BY_FARMER_ID(farmer_id)),
    delByPrefix(PRODUCTION_KEYS.SEARCH_PREFIX),
  ];

  if (production_route != null) {
    deletes.push(cacheDel(PRODUCTION_KEYS.BY_ROUTE(production_route)));
  }

  await Promise.all(deletes);
}

export async function searchProductions({
  search = "",
  filterBy = "none",
  date = "",
  status = "all",
}) {
  const key = PRODUCTION_KEYS.SEARCH(status, filterBy, search, date);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const query = {};

  if (status !== "all") query.status = status;
  if (search && filterBy === "name")
    query["farmer.name"] = { $regex: search, $options: "i" };
  if (search && filterBy === "id") query["farmer._id"] = search;

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    query.registration_time = { $gte: start, $lte: end };
  }

  const productions = await Production.find(query)
    .populate("farmer")
    .sort({ registration_time: -1 });

  await cacheSet(key, productions, TTL.PRODUCTION_SEARCH);
  return productions;
}

export async function submitProduction(farmer_id, volume) {
  const exists = await productionRepository.isExistsTodayProd(farmer_id);
  if (exists) throw new errors.BadRequestError("Cannot submit again.");

  const farmer = await farmerRepo.findById(farmer_id);
  if (!farmer)
    throw new errors.BadRequestError("Farmer with give id not found.");

  const production = {
    farmer: {
      _id: farmer._id,
      pinNo: farmer.pinNo,
      shortName: farmer.shortName,
      name: farmer.name,
      location: farmer.location,
      address: farmer.address,
      phone: farmer.phone,
      route: farmer.route,
    },
    volume: volume,
  };

  const result = await productionRepository.submit(production);

  await invalidateProductionCaches(farmer_id, farmer.route);

  return result;
}

export async function getMyProductions(farmer_id) {
  const key = PRODUCTION_KEYS.HISTORY_BY_FARMER(farmer_id);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const productions = await Production.find({
    "farmer._id": farmer_id,
    status: { $in: ["failed", "collected"] },
  }).sort({ createdAt: -1 });

  await cacheSet(key, productions, TTL.HISTORY_PROD);
  return productions;
}

// export async function getMyProductionToday(farmer_id) {
//   // const key = PRODUCTION_KEYS.TODAY_BY_FARMER(farmer_id);

//   // // Must read raw to distinguish "cached null" from "cache miss"
//   // const redis = getRedisClient();
//   // const raw = await redis.get(String(key));

//   // if (raw !== null) {
//   //   return JSON.parse(raw); // could be null (sentinel) or actual object
//   // }

//   // const existing = await productionRepository.isExistsTodayProd(farmer_id);

//   // if (existing) {
//   //   const production = _.pick(existing, [
//   //     "_id",
//   //     "volume",
//   //     "status",
//   //     "registration_time",
//   //     "failure_reason",
//   //     "collectedVolume",
//   //     "blocked",
//   //   ]);
//   //   await cacheSet(key, production, TTL.TODAY_PROD);
//   //   return production;
//   // }

//   // await cacheSet(key, null, TTL.TODAY_PROD);
//   // return null;
// }

export async function getMyProductionToday(farmer_id) {
  const existing = await productionRepository.isExistsTodayProd(farmer_id);

  if (!existing) return null;

  return _.pick(existing, [
    "_id",
    "volume",
    "status",
    "registration_time",
    "failure_reason",
    "collectedVolume",
    "blocked",
  ]);
}

export async function updateProductionService(
  farmer_id,
  production_id,
  volume,
) {
  if (volume <= 0) throw new errors.BadRequestError("Volume cannot be 0");

  const production = await Production.findOne(
    { _id: production_id, "farmer._id": farmer_id },
    null,
  );

  if (!production) throw new Error("Production not found");

  const LOCKED_STATUSES = ["collected", "failed"];

  if (LOCKED_STATUSES.includes(production.status)) {
    throw new errors.BadRequestError(
      `Cannot update production that is already ${production.status}`,
    );
  }

  production.volume = volume;
  await production.save();

  // Only update if we have a Route that included this production
  const route = await Route.findOne({
    "stops.production._id": production_id,
  });

  // if (route) {
  //   const stopIndex = route.stops.findIndex(
  //     (stop) => stop.production?._id.toString() === production_id.toString(),
  //   );

  //   if (stopIndex !== -1) {
  //     route.stops[stopIndex].production = production.toObject();
  //     route.markModified(`stops.${stopIndex}.production`);
  //     await route.save();
  //   }
  // }

  await invalidateProductionCaches(farmer_id, production.farmer?.route);

  return production;
}

export async function deleteProductionService(farmer_id, production_id) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const production = await Production.findOne({ _id: production_id }, null, {
      session,
    });

    if (!production) throw new errors.NotFoundError("Production not found");

    if (production.status === "collected") {
      throw new errors.BadRequestError(
        "Collected production cannot be canceled",
      );
    }

    if (production.status === "failed") {
      throw new errors.BadRequestError("Production already canceled");
    }

    production.status = "failed";
    production.failure_reason = "Canceled by farmer";
    production.blocked = true;

    await production.save({ session });

    const route = await Route.findOne(
      { "stops.production._id": production_id },
      null,
      { session },
    );

    if (route) {
      route.stops = route.stops.map((stop) => {
        if (stop.production?._id.toString() === production_id.toString()) {
          return { ...stop.toObject(), production: production.toObject() };
        }
        return stop;
      });
      await route.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    await invalidateProductionCaches(farmer_id, production.farmer?.route);

    return;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

export async function getAllPendingProductions() {
  const key = PRODUCTION_KEYS.ALL_PENDING;

  const cached = await cacheGet(key);
  if (cached) return cached;

  const productions = await productionRepository.findAllPending();
  await cacheSet(key, productions, TTL.ALL_PENDING);
  return productions;
}

export async function blockProduction(productionId) {
  const production = await productionRepository.findById(productionId);
  if (!production) throw new Error("Production with given ID not found");

  if (production.status !== "pending") {
    throw new errors.ConflictError(
      "Cannot hold productions that is not pending",
    );
  }

  const newBlockedStatus = !production.blocked;
  const result = await productionRepository.updateStatus(
    productionId,
    newBlockedStatus,
  );

  await invalidateProductionCaches(
    production.farmer._id,
    production.farmer?.route,
  );

  return result;
}

export async function getProductionsByFarmerId(farmer_id) {
  const key = PRODUCTION_KEYS.BY_FARMER_ID(farmer_id);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const productions = await productionRepository.findByFarmerId(farmer_id);
  if (!productions || productions.length === 0)
    throw new Error("No production records found for this farmer");

  await cacheSet(key, productions, TTL.PROD_BY_FARMER);
  return productions;
}

export async function getProductionsByRoute(route) {
  const key = PRODUCTION_KEYS.BY_ROUTE(route);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const productions = await productionRepository.findByRoute(route);
  if (!productions || productions.length === 0)
    throw new Error("No production records found for this route");

  await cacheSet(key, productions, TTL.PROD_BY_ROUTE);
  return productions;
}
