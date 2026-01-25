import Config from "./config.model.js";

export async function findAll() {
  return await Config.find();
}

export async function create(data) {
  const config = new Config(data);
  return await config.save();
}

export async function updateTemplate(deport_location, notification_template) {
  return await Config.findOneAndUpdate(
    {
      "deport_location.lat": deport_location.lat,
      "deport_location.lon": deport_location.lon,
    },
    { $set: { notification_template } },
    { new: true }
  );
}

export async function getByDeportLocation(deport_location) {
  return await Config.findOne({
    "deport_location.lat": deport_location.lat,
    "deport_location.lon": deport_location.lon,
  });
}

export async function getConfig() {
  return Config.findOne();
}

export async function createConfig(data) {
  return Config.create(data);
}

export async function updateDepotLocation(configId, depotCoords) {
  return Config.findByIdAndUpdate(
    configId,
    {
      $set: {
        depot_location: depotCoords,
      },
    },
    { new: true }
  );
}
