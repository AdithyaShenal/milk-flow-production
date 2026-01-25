import mongoose from "mongoose";

const routeConfigSchema = new mongoose.Schema(
  {
    autoClusterization: {
      type: Boolean,
      default: false,
    },
    routeWiseClusterization: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const RouteConfig = mongoose.model("RouteConfig", routeConfigSchema);

export default RouteConfig;
