import * as farmerRepository from "./farmer.repository.js";

export async function createFarmer(data) {
  return await farmerRepository.create(data);
}

export async function getAllFarmers() {
  const farmers = await farmerRepository.findAll();
  return farmers;
}

export async function getFarmersById(id) {
  const farmer = await farmerRepository.findById(id);
  if (!farmer) throw new Error("Farmer not found!");

  return farmer;
}

export async function getFarmersByName(name) {
  const farmers = await farmerRepository.findByName(name);
  if (!farmers || farmers.length === 0)
    throw new Error("No farmer found with this relevant name");

  return farmers;
}

export async function getFarmersByRoute(route) {
  const farmers = await farmerRepository.findByRoute(route);
  if (!farmers || farmers.length === 0)
    throw new Error("No farmers found in this route");
  return farmers;
}

export async function updateFarmer(id, data) {
  const farmer = await farmerRepository.findById(id);
  if (!farmer) throw new Error("Farmer not found");

  return farmerRepository.update(id, data);
}

export async function deleteFarmer(id) {
  const farmer = await farmerRepository.findById(id);
  if (!farmer) throw new Error("Farmer not found");

  return farmerRepository.remove(id);
}
