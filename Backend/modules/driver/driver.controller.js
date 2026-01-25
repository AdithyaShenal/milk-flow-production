import * as driverService from "./driver.service.js";
import { successResponse } from "../../util/response.js";
import Driver from "./driver.model.js";

export async function createDriver(req, res, next) {
  console.log(JSON.stringify(req.body));
  try {
    const driver = await driverService.createDriver(req.body);
    return successResponse(res, driver, 201);
  } catch (err) {
    next(err);
  }
}

export async function findDrivers(req, res) {
  const { search = "", filterBy = "none", status = "all" } = req.query;

  const query = {};

  if (status !== "all") {
    query.status = status;
  }

  if (search && filterBy === "name") {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (search && filterBy === "id") {
    query._id = search;
  }

  if (search && filterBy === "license") {
    query.driver_license_no = {
      $regex: search,
      $options: "i",
    };
  }

  const drivers = await Driver.find(query).sort({ name: 1 });

  return res.status(200).json(drivers);
}

export async function updateDriver(req, res) {
  const driverId = req.params.driverId;

  const driver = await driverService.updateDriver(driverId, req.body);
  return res.status(200).json(driver);
}

export async function getDriverById(req, res, next) {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    return res.json(driver);
  } catch (err) {
    next(err);
  }
}

export async function deleteDriver(req, res, next) {
  try {
    await driverService.deleteDriver(req.params.id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function toggleDriverStatus(req, res) {
  const driverId = req.params.driverId;

  const driver = await driverService.toggleDriverStatus(
    driverId,
    req.body.status
  );

  return res.status(200).json(driver);
}
