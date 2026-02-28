import * as driverRepository from "./driver.repository.js";
import * as errors from "../../errors/errors.js";
import Driver from "./driver.model.js";
import { cacheGet, cacheSet, cacheDel, delByPrefix } from "../../lib/redis.js";
import { DRIVER_KEYS, TTL } from "../../lib/cacheKeys.js";

async function invalidateDriverCaches(driver) {
  await Promise.all([
    cacheDel(DRIVER_KEYS.ALL_DRIVERS),
    cacheDel(DRIVER_KEYS.DRIVER_BY_ID(driver._id)),
    cacheDel(DRIVER_KEYS.DRIVER_BY_LICENSE(driver.driver_license_no)),
    delByPrefix(DRIVER_KEYS.SEARCH_PREFIX),
  ]);
}

function generatePin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function findDrivers({
  search = "",
  filterBy = "none",
  status = "all",
}) {
  const key = DRIVER_KEYS.SEARCH(status, filterBy, search);

  const cached = await cacheGet(key);
  if (cached) {
    console.log("Cache Hit");
    return cached;
  }

  const query = {};

  if (status !== "all") query.status = status;
  if (search && filterBy === "name")
    query.name = { $regex: search, $options: "i" };
  if (search && filterBy === "id") query._id = search;
  if (search && filterBy === "license")
    query.driver_license_no = { $regex: search, $options: "i" };

  const drivers = await Driver.find(query).sort({ name: 1 });

  await cacheSet(key, drivers, TTL.DRIVER_SEARCH);
  return drivers;
}

export async function findAll() {
  const key = DRIVER_KEYS.ALL_DRIVERS;

  const cached = await cacheGet(key);
  if (cached) return cached;

  const drivers = await driverRepository.findAll();
  if (!drivers || drivers.length === 0)
    throw new errors.NotFoundError("Drivers not found");

  await cacheSet(key, drivers, TTL.ALL_DRIVERS);
  return drivers;
}

export async function getDriverById(id) {
  const key = DRIVER_KEYS.DRIVER_BY_ID(id);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const driver = await driverRepository.findDriverById(id);
  if (!driver) throw new errors.NotFoundError("Driver not found");

  await cacheSet(key, driver, TTL.DRIVER_DETAIL);
  return driver;
}

export async function getDriverByLicenseNo(driver_license_no) {
  const key = DRIVER_KEYS.DRIVER_BY_LICENSE(driver_license_no);

  const cached = await cacheGet(key);
  if (cached) return cached;

  const driver =
    await driverRepository.findDriverByLicenseNo(driver_license_no);
  if (!driver) throw new errors.NotFoundError("Driver not found");

  await cacheSet(key, driver, TTL.DRIVER_DETAIL);
  return driver;
}

export async function createDriver(data) {
  const existing = await driverRepository.findDriverByLicenseNo(
    data.driver_license_no,
  );
  if (existing) throw new errors.BadRequestError("Driver already exists");

  let pin;
  let exists = true;

  while (exists) {
    pin = generatePin();
    exists = await Driver.exists({ pinNo: pin });
  }

  const driver = await driverRepository.create({ ...data, pinNo: pin });

  await Promise.all([
    cacheDel(DRIVER_KEYS.ALL_DRIVERS),
    delByPrefix(DRIVER_KEYS.SEARCH_PREFIX),
  ]);

  return driver;
}

export async function updateDriver(id, data) {
  const driver = await driverRepository.findDriverById(id);
  if (!driver) throw new errors.NotFoundError("Driver not found");

  const updated = await driverRepository.update(id, data);

  await invalidateDriverCaches(driver);

  return updated;
}

export async function deleteDriver(id) {
  const driver = await driverRepository.findDriverById(id);
  if (!driver) throw new errors.NotFoundError("Driver not found");

  const result = await driverRepository.delete_driver(id);

  await invalidateDriverCaches(driver);

  return result;
}

export async function toggleDriverStatus(driverId, status) {
  const driver = await driverRepository.findDriverById(driverId);
  if (!driver) throw new errors.NotFoundError("Driver not found");

  if (driver.status === "onDuty") {
    throw new errors.ValidationError(
      "Cannot change status while driver is on duty",
    );
  }

  const updated = await driverRepository.toggleStatus(driverId, status);

  await invalidateDriverCaches(driver);

  return updated;
}
