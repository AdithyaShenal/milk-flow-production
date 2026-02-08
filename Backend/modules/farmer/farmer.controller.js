import * as farmerService from "./farmer.service.js";
import { successResponse } from "../../util/response.js";
import mongoose from "mongoose";
import Farmer from "./farmer.model.js";

export async function createFarmer(req, res, next) {
  const farmer = await farmerService.createFarmer(req.body);
  successResponse(res, farmer, 200);
}

export async function getAll(req, res) {
  const farmers = await Farmer.find();

  res.status(200).json(farmers);
}

export async function getAllFarmers(req, res, next) {
  const { search = "", filterBy = "", route = "all" } = req.query;

  const query = {};

  if (route !== "all") {
    query.route = Number(route);
  }

  if (search && filterBy === "name") {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (search && filterBy === "address") {
    query.address = {
      $regex: search,
      $options: "i",
    };
  }

  if (search && filterBy === "id" && mongoose.Types.ObjectId.isValid(search)) {
    query._id = search;
  }

  const farmers = await Farmer.find(query).sort({ createdAt: -1 });

  return res.status(200).json(farmers);
}

export async function getFarmersById(req, res, next) {
  try {
    const farmer = await farmerService.getFarmersById(req.params.id);
    return res.json(farmer);
  } catch (err) {
    next(err);
  }
}

export async function getFarmersByName(req, res, next) {
  try {
    const farmer = await farmerService.getFarmersByName(req.params.name);
    return res.json(farmer);
  } catch (err) {
    next(err);
  }
}

export async function getFarmersByRoute(req, res, next) {
  try {
    const farmers = await farmerService.getFarmersByRoute(
      parseInt(req.params.route),
    );
    return res.json(farmers);
  } catch (err) {
    next(err);
  }
}

export async function updateFarmer(req, res, next) {
  try {
    const farmer = await farmerService.updateFarmer(req.params.id, req.body);
    return res.json(farmer);
  } catch (err) {
    next(err);
  }
}

export async function deleteFarmer(req, res, next) {
  try {
    await farmerService.deleteFarmer(req.params.id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
