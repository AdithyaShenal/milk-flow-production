import * as fleetService from "./fleet.service.js";
import { successResponse } from "../../util/response.js";

export async function createTruck(req, res, next) {
  try {
    const truck = await fleetService.createTruck(req.body);
    successResponse(res, truck, 201);
  } catch (err) {
    next(err);
  }
}

export async function getAllTrucks(req, res, next) {
  const { search = "", filterBy = "", status = "all" } = req.query;

  const trucks = await fleetService.searchTrucks({ search, filterBy, status });

  return res.status(200).json(trucks);
}

export async function getTruckById(req, res, next) {
  try {
    const truck = await fleetService.getTruckById(req.params.id);
    return res.json(truck);
  } catch (err) {
    next(err);
  }
}

export async function updateTruck(req, res) {
  const truckId = req.params.truckId;

  const truck = await fleetService.updateTruck(truckId, req.body);
  return res.status(200).json(truck);
}

export async function deleteTruck(req, res, next) {
  try {
    await fleetService.deleteTruck(req.params.id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getTrucksByRoute(req, res, next) {
  try {
    const trucks = await fleetService.getTrucksByRoute(req.params.route);
    return res.json(trucks);
  } catch (err) {
    next(err);
  }
}

export async function toggleTruckStatus(req, res) {
  const truckId = req.params.truckId;

  const truck = await fleetService.toggleTruckStatus(truckId, req.body.status);

  return res.status(200).json(truck);
}
