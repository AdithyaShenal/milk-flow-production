import express from "express";
import * as dashboardController from "./dashboard.controller.js";

const router = express.Router();

router.get("/", dashboardController.getDashboardData);

router.get("/:date", dashboardController.getDashboardData);

export default router;
