import mongoose, { model } from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    license_no: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      max: 2500,
      min: 0,
    },
    status: {
      type: String,
      enum: ["available", "unavailable", "inService"],
      default: "available",
    },
    model: {
      type: String,
      required: true,
    },
    distance_travelled: {
      type: Number,
      min: 0,
    },
    route: {
      type: Number,
      max: 6,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const Trucks = model("Truck", truckSchema);

export default Trucks;
