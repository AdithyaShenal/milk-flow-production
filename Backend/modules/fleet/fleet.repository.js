import Trucks from "./fleet.model.js";

export async function findAll() {
  return await Trucks.find();
}
export async function findTruckByLicenseNo(license_no) {
  return await Trucks.findOne({ license_no });
}
export async function create(data) {
  const truck = new Trucks(data);
  return await truck.save();
}

export async function update(id, data) {
  return await Trucks.findByIdAndUpdate(id, data, {
    new: true,
    //tells us to return the updated document
  });
}

export async function delete_Truck(id) {
  return await Trucks.findByIdAndDelete(id);
}

export async function findTruckById(id) {
  return await Trucks.findById(id);
}

export async function findTrucksByRoute(route) {
  return await Trucks.find({ route });
}

//toggle truck availability
export async function toggleStatus(truckId, status) {
  return await Trucks.findByIdAndUpdate(
    truckId,
    {
      $set: {
        status: status,
      },
    },
    { new: true }
  );
}
