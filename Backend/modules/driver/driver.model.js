import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    match: /^\d{10}$/,
  },
  status: {
    type: String, // remove inService
    enum: ["available", "unavailable", "onDuty"],
    default: "available", // available
  },
  driver_license_no: {
    type: String,
    required: true,
    unique: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  pinNo: {
    type: String,
    required: true,
  },
});

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
