import * as fleetService from "./fleet.service.js";
import { successResponse } from "../../util/response.js";
import mongoose from "mongoose";
import Truck from "./fleet.model.js";

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

  const query = {};

  if (status !== "all") {
    query.status = status;
  }

  if (search && filterBy === "model") {
    query.model = {
      $regex: search,
      $options: "i",
    };
  }

  if (search && filterBy === "license_no") {
    query.license_no = {
      $regex: search,
      $options: "i",
    };
  }

  if (search && filterBy === "id" && mongoose.Types.ObjectId.isValid(search)) {
    query._id = search;
  }

  const trucks = await Truck.find(query).sort({ createdAt: -1 });

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
