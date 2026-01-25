import mongoose from "mongoose";

const qualitySchema = new mongoose.Schema({
  fat: Number,
  lat: Number,
  density: Number,
  water_ratio: Number,
});

const embeddedFarmerSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    address: {
      type: String,
      required: true,
    },
    route: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

export const productionSchema = new mongoose.Schema(
  {
    farmer: {
      type: embeddedFarmerSchema,
      required: true,
    },

    volume: {
      type: Number,
      required: true,
      min: 0,
    },

    registration_time: {
      type: Date,
      default: Date.now,
    },

    failure_reason: {
      type: String,
      default: "-",
      required: false,
    },

    status: {
      type: String,
      enum: ["pending", "awaiting pickup", "collected", "failed"],
      default: "pending",
    },

    collectedVolume: {
      type: Number,
      default: 0,
      min: 0,
    },

    blocked: {
      type: Boolean,
      default: false,
    },

    quality: qualitySchema,
  },
  { timestamps: true }
);

export const Production = mongoose.model("Production", productionSchema);

export default Production;
