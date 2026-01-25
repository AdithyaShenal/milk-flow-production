import * as configRepository from "./config.repository.js";
import * as errors from "../../errors/errors.js";

export async function getConfig() {
  const config = await configRepository.findAll();
  if (!config || config.length === 0)
    throw new errors.NotFoundError("Data not found");
  return config;
}

export async function updateDepotLocation(depotCoords) {
  let config = await configRepository.getConfig();

  if (!config) {
    config = await configRepository.createConfig({
      depot_location: depotCoords,
    });
  } else {
    config = await configRepository.updateDepotLocation(
      config._id,
      depotCoords
    );
  }

  return config;
}

export async function updateNotification(
  deport_location,
  notification_template
) {
  const deport = await configRepository.getByDeportLocation(deport_location);
  if (!deport) throw new errors.NotFoundError("deport not found");
  return await configRepository.updateTemplate(
    deport_location,
    notification_template
  );
}

export async function updateLat_Fat_Table(deport_location, lat_fat_table) {
  const deport = await configRepository.getByDeportLocation(deport_location);
  if (!deport) throw new errors.NotFoundError("Deport not found");
  //checkin the number of columns and rows
  const { lat, fat, rates } = lat_fat_table;
  const invalidRow = rates.some((row) => fat.length != row.length);
  if (lat.length != rates.length)
    throw new errors.BadRequestError("rows data are not equal");
  else if (invalidRow)
    throw new errors.BadRequestError("rows data are not equal");

  return await configRepository.updateLat_Fat_Table(
    deport_location,
    lat_fat_table
  );
}
export async function create(deport_location) {
  const deport = await configRepository.getByDeportLocation(deport_location);
  if (deport) throw new errors.NotFoundError("Deport already exists");
  return await configRepository.create(deport_location);
}
