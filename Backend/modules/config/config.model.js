import mongoose from "mongoose";

const lat_fat_tableSchema = new mongoose.Schema({
  lat: { type: [Number], required: true },
  fat: { type: [Number], required: true },
  rates: { type: [[Number]], required: true },
});

const configSchema = new mongoose.Schema(
  {
    depot_location: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },

    notification_template: {
      type: String,
      match: [/\d/, "template should contain at least one number"],
    },

    lat_fat_table: {
      type: lat_fat_tableSchema,
    },
  },
  { timestamps: true }
);

const Config = mongoose.model("Config", configSchema);

export default Config;
