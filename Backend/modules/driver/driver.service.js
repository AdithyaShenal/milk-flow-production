import * as driverRepository from "./driver.repository.js";
import * as errors from "../../errors/errors.js";
import Driver from "./driver.model.js";

// Generate a random 4 digit pin
function generatePin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function findAll() {
  const drivers = await driverRepository.findAll();
  if (!drivers || drivers.length === 0)
    throw new errors.NotFoundError("Drivers not found");
  return drivers;
}

export async function createDriver(data) {
  const driver = await driverRepository.findDriverByLicenseNo(
    data.driver_license_no
  );

  if (driver) throw new errors.BadRequestError("Driver already exists");

  let pin;
  let exists = true;

  while (exists) {
    pin = generatePin();
    exists = await Driver.exists({ pinNo: pin });
  }

  const newDriver = { ...data, pinNo: pin };

  return await driverRepository.create(newDriver);
}

export async function updateDriver(id, data) {
  const driver = await driverRepository.findDriverById(id);
  if (!driver) throw new errors.NotFoundError("Driver not found");
  return await driverRepository.update(id, data);
}

export async function deleteDriver(id) {
  const driver = await driverRepository.findDriverById(id);
  if (!driver) throw new errors.NotFoundError("Driver not found");
  return await driverRepository.delete_driver(id);
}

export async function getDriverById(id) {
  const driver = await driverRepository.findDriverById(id);
  if (!driver) throw new errors.NotFoundError("Driver not found");
  return driver;
}

export async function getDriverByLicenseNo(driver_license_no) {
  const driver = await driverRepository.findDriverByLicenseNo(
    driver_license_no
  );
  if (!driver) throw new errors.NotFoundError("Driver not found");
  return driver;
}

export async function toggleDriverStatus(driverId, status) {
  const driver = await driverRepository.findDriverById(driverId);

  if (!driver) {
    throw new errors.NotFoundError("Driver not found");
  }

  if (driver.status === "onDuty") {
    throw new errors.ValidationError(
      "Cannot change status while driver is on duty"
    );
  }

  return await driverRepository.toggleStatus(driverId, status);
}
