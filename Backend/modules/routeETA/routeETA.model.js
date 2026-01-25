import mongoose from "mongoose";

const routeETASchema = new mongoose.Schema({
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
    index: true,
  },

  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
    required: true,
    index: true,
  },

  production_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Production",
    required: true,
    index: true,
  },

  stop_order: Number,

  eta: Date,
  eta_window_start: Date,
  eta_window_end: Date,

  calculatedAt: Date,
});

const RouteETA = mongoose.model("RouteETA", routeETASchema);

export default RouteETA;
