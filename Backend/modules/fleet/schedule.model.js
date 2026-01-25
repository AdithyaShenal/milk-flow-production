import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },

    scheduledRoute: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);
