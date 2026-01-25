import * as configService from "./config.service.js";
import { successResponse } from "../../util/response.js";
import Config from "./config.model.js";
import * as errors from "../../errors/errors.js";

export async function create(req, res, next) {
  try {
    const config = await configService.create(req.body);
    return successResponse(res, config, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateDepotLocation(req, res) {
  const { depotCoords } = req.body;

  if (
    !depotCoords ||
    typeof depotCoords.lat !== "number" ||
    typeof depotCoords.lon !== "number"
  ) {
    throw new errors.ValidationError("Coordinates not valid");
  }

  const config = await configService.updateDepotLocation(depotCoords);

  return res.status(200).json(config);
}

export async function getDepotLocation(req, res) {
  const config = await Config.findOne();

  if (!config) throw new errors.NotFoundError("Depot location not found");

  const depotLocation = config.depot_location;

  successResponse(res, depotLocation);
}

export async function getConfig(req, res) {
  const config = await Config.findOne();

  if (!config) {
    throw new errors.NotFoundError("System configurations not found.");
  }

  res.status(200).json(config);
}

export async function updateNotification(req, res, next) {
  try {
    const config = await configService.updateNotification(
      req.body.deport_location,
      req.body.notification_template
    );
    return res.json(config);
  } catch (err) {
    next(err);
  }
}

export async function updateLat_Fat_Table(req, res, next) {
  try {
    const config = await configService.updateLat_Fat_Table(
      req.body.deport_location,
      req.body.lat_fat_table
    );
    return res.json(config);
  } catch (err) {
    next(err);
  }
}
