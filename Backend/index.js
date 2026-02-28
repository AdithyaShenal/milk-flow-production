import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Route imports
import farmerRoutes from "./modules/farmer/farmer.routes.js";
import productionRoutes from "./modules/production/poduction.routes.js";
import farmerReportRoutes from "./modules/farmerReport/f_r.routes.js";
import routing from "./modules/routing/routing.routes.js";
import fleetRoutes from "./modules/fleet/fleet.routes.js";
import driverRoutes from "./modules/driver/driver.routes.js";
import analyticsRoutes from "./modules/analytics/analaytics.routes.js";
import farmerAuth from "./modules/user/farmer/farmer.login.js";
import driverAuth from "./modules/user/driver/driver.login.js";
import configRoutes from "./modules/config/config.routes.js";
import adminRoutes from "./modules/user/admin/admin.login.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

// Middleware import
import cookieParser from "cookie-parser";
import morgan from "morgan";
import err from "./middleware/error.js";
import cors from "cors";
import { initRedis } from "./lib/redisClient.js";

dotenv.config();
const app = express();

// DB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/MCLROS_DB")
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

//Middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://localhost", "http://localhost", "capacitor://localhost"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Routes
app.use("/api/auth/admin", adminRoutes);
app.use("/api/auth/driver", driverAuth);
app.use("/api/auth/farmer", farmerAuth);
app.use("/api/farmer", farmerRoutes);
app.use("/api/trucks", fleetRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/reports", farmerReportRoutes);
app.use("/api/production", productionRoutes);
app.use("/api/routing", routing);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/config", configRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(err);

const PORT = process.env.PORT || 5000;

const startup = async () => {
  try {
    await initRedis();
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed", err);
    process.exit(1);
  }
};

startup();
